document.addEventListener("DOMContentLoaded", function (event) {
    const days = [
        'Воскресенье',
        'Понедельник',
        'Вторник',
        'Среда',
        'Четверг',
        'Пятница',
        'Суббота',
    ];

    const padTo2Digits = (num) => String(num).padStart(2, '0');

    const getParsedJSON = (json) => {
        const dates = [];

        json.forEach((subject) => {
            const day = new Date(subject.timestart * 1000).getDay();
            if (dates.indexOf(days[day]) !== -1) return;
            else dates.push(days[day]);
        });

        const newDates = dates.map((oldDate) => {
            let subjects = json.map(subject => {
                const day = new Date(subject.timestart * 1000).getDay();
                if (days[day] === oldDate) return subject;
            })

            subjects = subjects.filter(Boolean);

            return { date: oldDate, subjects };
        });

        return newDates;
    }

    const startTimer = (endTime) => {
        const x = setInterval(() => {
            const distance = endTime - Date.now();
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            document.querySelectorAll(".timer--time").forEach(element => element.innerHTML = `
                ${padTo2Digits(hours)}:${padTo2Digits(minutes)}:${padTo2Digits(seconds)}
            `);

            if (distance < 0) {
                clearInterval(x);
                document.querySelectorAll(".timer--time").forEach(element => element.innerHTML = "");
                if (document.querySelector('.schedule_subject--current')) {
                    document.querySelectorAll(".schedule_subject--current")
                        .forEach(element => element.classList.remove("schedule_subject--current"));
                    document.querySelector('.timer').remove();
                } else {
                    document.querySelectorAll(".schedule_subject--next")
                        .forEach(element => element.classList.remove("schedule_subject--next"));
                    document.querySelector('.timer').remove();
                }
            }
        }, 1000);
    }

    const setSchedule = ({ target: { response } }) => {
        if (!response) return;
        const result = getParsedJSON(JSON.parse(response));
        const schedule_list = document.querySelector(".schedule_list");
        schedule_list.innerHTML = "";

        for (let j = 0; j < result.length; j++) {
            const schedule_block = document.createElement('li');
            schedule_block.className = 'schedule_block';
            const scheduleDate = result[j].date;
            const date = new Date(result[j].subjects[0].timestart * 1000).toLocaleDateString("ru", { dateStyle: "medium" });
            schedule_block.insertAdjacentHTML('afterbegin', `
                <p class="schedule_dayOfWeek">${scheduleDate}, ${date}</p>
            `);

            for (let i = 0; i < result[j].subjects.length; i++) {
                const element = document.createElement("li");
                const startTime = new Date(result[j].subjects[i].timestart * 1000);
                const endTime = new Date(result[j].subjects[i].timeend * 1000);
                const parsedStartTime = `${padTo2Digits(startTime.getHours())}:${padTo2Digits(startTime.getMinutes())}`;
                const parsedEndTime = `${padTo2Digits(endTime.getHours())}:${padTo2Digits(endTime.getMinutes())}`;

                const isThisTime = (Date.now() >= result[j].subjects[i].timestart * 1000)
                    && (Date.now() <= result[j].subjects[i].timeend * 1000);

                const isNext = (Date.now() < result[j].subjects[i].timestart * 1000)
                    && !schedule_block.querySelector('.schedule_subject--next')
                    && !document.querySelector('.schedule_subject--next')
                    && !schedule_block.querySelector('.schedule_subject--current')
                    && !document.querySelector('.schedule_subject--current');

                const isInOneTime = (result[j].subjects[i + 1]
                    && result[j].subjects[i].timestart === result[j].subjects[i + 1].timestart
                    && result[j].subjects[i].pairnumber === result[j].subjects[i + 1].pairnumber)
                    || (result[j].subjects[i - 1]
                        && result[j].subjects[i].timestart === result[j].subjects[i - 1].timestart
                        && result[j].subjects[i].pairnumber === result[j].subjects[i - 1].pairnumber)

                if (isThisTime) startTimer(result[j].subjects[i].timeend * 1000);
                if (isNext) startTimer(result[j].subjects[i].timestart * 1000);

                let edworkkindColor = '';

                switch (result[j].subjects[i].edworkkind) {
                    case "пр.з.": edworkkindColor = 'green'; break;
                    case "лек.": edworkkindColor = 'purple'; break;
                    case "лаб.": edworkkindColor = 'blue'; break;
                    case "зач.": edworkkindColor = 'red'; break;
                    case "ТЕСТ": edworkkindColor = 'red'; break;
                }

                const teacherInfo = result[j].subjects[i].teacher
                    ? `${result[j].subjects[i].teacher.pos} ${result[j].subjects[i].teacher.name}`
                    : "";

                const subgroup = result[j].subjects[i].subgroup
                    ? result[j].subjects[i].subgroup.slice(0, 1)
                    : "";

                const roomInfo = !result[j].subjects[i].online && result[j].subjects[i].room ? `
                    Каб. ${result[j].subjects[i].room.name}, 
                    ${result[j].subjects[i].room.area}, 
                    ${result[j].subjects[i].room.address}
                ` : "";

                element.classList.add("schedule_subject");
                if (isInOneTime) element.classList.add("schedule_subject--pair");
                if (isThisTime) element.classList.add("schedule_subject--current");
                else if (isNext) element.classList.add("schedule_subject--next");

                element.insertAdjacentHTML('afterbegin', `
                    <div class="schedule_subject_time">
                        <time
                            datetime="${parsedStartTime}" 
                            class="schedule_subject--time">
                            ${parsedStartTime}
                        </time>

                        <p class="schedule_subject--number">
                            ${result[j].subjects[i].pairnumber}
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
                                ${result[j].subjects[i].edworkkind}
                            </span>

                            ${subgroup ? `
                                <span class="schedule_subject--subgroup">
                                    ${subgroup} п/г
                                </span>
                            ` : ''}

                            ${result[j].subjects[i].online ? `
                                <span class="schedule_subject--online">
                                    онлайн
                                </span>
                            ` : ""}
                        </div>

                        <div class="schedule_subject--name">
                            ${result[j].subjects[i].links ? `
                                <a
                                    title="В курс"
                                    target="_blank"
                                    href="${result[j].subjects[i].links[0].href}">
                                    ${result[j].subjects[i].dis}
                                </a>
                            ` : result[j].subjects[i].dis}
                        </div>

                        <p class="schedule_subject--teacher">
                            ${result[j].subjects[i].links ? `
                                <a
                                    title="В курс"
                                    target="_blank"
                                    href="${result[j].subjects[i].links[0].href}">
                                    ${teacherInfo}
                                </a>
                            ` : teacherInfo}
                        </p>

                        ${roomInfo}
                    </div>

                    ${isThisTime || isNext ? `
                        <div class="timer">
                            <img class="timer--img" alt="timer" src="/images/timer.svg"/>
                            <span class="timer--time">---</span>
                        </div>
                    ` : ''}
                `);

                schedule_block.insertAdjacentElement('beforeend', element);
            };

            schedule_list.appendChild(schedule_block);
        }
    };

    const scrollToSubjectBtn = document.querySelector('.scroll_to_subject_btn');
    const input = document.querySelector('.schedule_form');
    const current = new Date(new Date().toUTCString())
    const firstDay = new Date(current.setUTCDate(current.getUTCDate() - current.getUTCDay() + 1));
    const lastDay = new Date(current.setUTCDate(current.getUTCDate() - current.getUTCDay() + 7));
    const fromDate = `${firstDay.toISOString().substring(0, 10)}`;
    const toDate = `${lastDay.toISOString().substring(0, 10)}`;

    chrome.storage.local.get("group", ({ group }) => {
        if (!group) return;
        const schedule_group = document.querySelector('.schedule_group');
        schedule_group.textContent = group;
        const schedule_external = document.querySelector('.schedule_external');
        schedule_external.href = `https://bsuedu.ru/bsu/education/schedule/groups/index.php?group=${group}`;

        const xhr = new XMLHttpRequest();
        xhr.open("GET", `https://beluni.ru/schedule/g/${group}?from=${fromDate}&to=${toDate}&qdist=1`);
        xhr.send();
        xhr.onload = setSchedule;
    });

    input.addEventListener('submit', (event) => {
        event.preventDefault();
        const input = document.querySelector('.schedule_input');
        const value = document.querySelector('.schedule_input').value;
        if (!value) return;
        input.value = '';
        const schedule_group = document.querySelector('.schedule_group');
        schedule_group.textContent = value;
        const schedule_external = document.querySelector('.schedule_external');
        schedule_external.href = `https://bsuedu.ru/bsu/education/schedule/groups/index.php?group=${value}`;
        chrome.storage.local.set({ group: value });

        const xhr = new XMLHttpRequest();
        xhr.open("GET", `https://beluni.ru/schedule/g/${value}?from=${fromDate}&to=${toDate}&qdist=1`);
        xhr.send();
        xhr.onload = setSchedule;
    });

    scrollToSubjectBtn.addEventListener('click', (event) => {
        event.preventDefault();

        if (!document.querySelector('.schedule_subject--current')) {
            const dates = document.querySelectorAll('.schedule_dayOfWeek');
            const currentDate = new Date().toLocaleDateString("ru", { dateStyle: "medium" });
            let date = null;

            dates.forEach((node) =>
                node.textContent.split(', ')[1] === currentDate
                    ? date = node : null
            );

            if (date) date.scrollIntoView({ behavior: "smooth", block: "center" });
            else dates[dates.length - 1].scrollIntoView({ behavior: "smooth", block: "center" });
            return;
        }

        document.querySelector('.schedule_subject--current').scrollIntoView({ behavior: "smooth", block: "center" })
    })
});

