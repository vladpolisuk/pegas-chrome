import { startTimer } from "./startTimer.js";
import { getParsedJSON } from "./getParsedJSON.js";
import { padTo2Digits } from "./utils/padTo2Digits.js"

let currentTimer = null;

export function setSchedule({ target: { response } }) {
    if (!response) return;
    clearInterval(currentTimer);
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

            if (isThisTime)
                currentTimer = startTimer(result[j].subjects[i].timeend * 1000);

            else if (isNext)
                currentTimer = startTimer(result[j].subjects[i].timestart * 1000);

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
            if (isThisTime)
                element.classList.add("schedule_subject--current");
            else if (isNext)
                element.classList.add("schedule_subject--next");

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
}