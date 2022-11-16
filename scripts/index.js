const padTo2Digits = (num) => String(num).padStart(2, '0');

const setSchedule = ({ target: { response } }) => {
    const result = JSON.parse(response);
    const schedule_list = document.querySelector(".schedule_list");
    schedule_list.innerHTML = "";

    const days = [
        'Воскресенье',
        'Понедельник',
        'Вторник',
        'Среда',
        'Четверг',
        'Пятница',
        'Суббота'
    ];

    for (let i = 0; i < result.length; i++) {
        const element = document.createElement("li");
        const day = new Date(result[i].timestart * 1000).getDay();
        const date = new Date(result[i].timestart * 1000).toLocaleDateString("ru", { dateStyle: "medium" });
        const startTime = new Date(result[i].timestart * 1000);
        const endTime = new Date(result[i].timeend * 1000);
        const parsedStartTime = `${padTo2Digits(startTime.getHours())}:${padTo2Digits(startTime.getMinutes())}`;
        const parsedEndTime = `${padTo2Digits(endTime.getHours())}:${padTo2Digits(endTime.getMinutes())}`;
        const isThisTime = new Date().getHours() >= startTime.getHours()
            && new Date().getHours() <= endTime.getHours()
            && new Date().getDay() == day;
        const teacherInfo = result[i].teacher ? `${result[i].teacher.pos} ${result[i].teacher.name}` : "";
        const subgroup = result[i].subgroup ? result[i].subgroup.slice(0, 1) : "";

        let edworkkindColor = '';

        switch (result[i].edworkkind) {
            case "пр.з.": edworkkindColor = 'green'; break;
            case "лек.": edworkkindColor = 'purple'; break;
            case "лаб.": edworkkindColor = 'blue'; break;
            case "зач.": edworkkindColor = 'red'; break;
        }

        element.innerHTML = `
            ${result[i].pairnumber == 1 ? `
                <p class="schedule_dayOfWeek">${days[day]}, ${date}</p>
            ` : ""}
            
            <div class="schedule_subject ${isThisTime ? "schedule_subject--current" : ""}">
                <div class="schedule_subject_time">
                    <time
                        datetime="${parsedStartTime}" 
                        class="schedule_subject--time">
                        ${parsedStartTime}
                    </time>

                    <p class="schedule_subject--number">
                        ${result[i].pairnumber}
                    </p>

                    <time
                        datetime="${parsedEndTime}" 
                        class="schedule_subject--time">
                        ${parsedEndTime}
                    </time>
                </div>

                <div class="schedule_subject_info">
                    <div class="schedule_subject--badges">
                        <span class="schedule_subject--edworkkind schedule_subject--edworkkind-${edworkkindColor}">
                            ${result[i].edworkkind}
                        </span>

                        ${subgroup ? `
                            <span class="schedule_subject--subgroup">
                                ${subgroup} п/г
                            </span>
                        ` : ''}

                        ${result[i].online ? `
                            <span class="schedule_subject--online">
                                онлайн
                            </span>
                        ` : ""}
                    </div>

                    <div class="schedule_subject--name">
                        <a  
                            title="В курс"
                            target="_blank"
                            href="${result[i].links[0].href}">
                            ${result[i].dis}
                        </a>
                    </div>

                    <p class="schedule_subject--teacher">
                        <a
                            title="В курс"
                            target="_blank"
                            href="${result[i].links[0].href}">
                            ${teacherInfo}
                        </a>
                    </p>

                    ${!result[i].online && result[i].room ? `
                        Каб. ${result[i].room.name}, ${result[i].room.area}, ${result[i].room.address}
                    `: ""}
                </div>

            </ >
            `;

        schedule_list.appendChild(element);
    }
};

const schedule_list = document.querySelector('.schedule_list');
const input = document.querySelector('.schedule_form');
const current = new Date();
const firstDay = new Date(current.setDate(current.getDate() - current.getDay()));
const lastDay = new Date(current.setDate(current.getDate() - current.getDay() + 6));
const fromDate = `${firstDay.toISOString().substring(0, 10)}`;
const toDate = `${lastDay.toISOString().substring(0, 10)}`;

chrome.storage.local.get("group", ({ group }) => {
    if (group) {
        const schedule_group = document.querySelector('.schedule_group');
        schedule_group.textContent = group;
        const schedule_external = document.querySelector('.schedule_external');
        schedule_external.href = `https://bsuedu.ru/bsu/education/schedule/groups/index.php?group=${group}`;
        const xhr = new XMLHttpRequest();
        xhr.open("GET", `https://beluni.ru/schedule/g/${group}?from=${fromDate}&to=${toDate}&qdist=1`);
        xhr.send();
        xhr.onload = setSchedule;
    }
})

input.addEventListener('submit', (event) => {
    event.preventDefault();
    const schedule_group = document.querySelector('.schedule_group');
    const value = document.querySelector('.schedule_input').value;
    const schedule_external = document.querySelector('.schedule_external');
    schedule_group.textContent = value;
    schedule_external.href = `https://bsuedu.ru/bsu/education/schedule/groups/index.php?group=${value}`;

    chrome.storage.local.set({ group: value })

    const xhr = new XMLHttpRequest();
    xhr.open("GET", `https://beluni.ru/schedule/g/${value}?from=${fromDate}&to=${toDate}&qdist=1`);
    xhr.send();
    xhr.onload = setSchedule;
})

