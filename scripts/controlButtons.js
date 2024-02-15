import { currentWeek } from "./currentWeek.js";
import { groupInputListener, groupStorage } from "./groupStorage.js";
import { setSchedule } from "./setSchedule.js";
import { getDateInformation } from "./utils/getDateInformation.js";

let count = 0;

export function controlButtons() {
    const nextBtnElement = document.querySelector('.next-btn');
    const prevBtnElement = document.querySelector('.prev-btn');

    prevBtnElement.disabled = true

    nextBtnElement.addEventListener('click', () => {
        if (prevBtnElement.disabled === true)
            prevBtnElement.disabled = false;
    
        ++count;
        const { fromDate, toDate } = getDateInformation(count);
        currentWeek({ fromDate, toDate });
        groupStorage(fromDate, toDate, setSchedule);
        groupInputListener(fromDate, toDate, setSchedule);
    })

    prevBtnElement.addEventListener('click', () => {
        --count;
        const { fromDate, toDate } = getDateInformation(count);
        currentWeek({ fromDate, toDate });
        groupStorage(fromDate, toDate, setSchedule);
        groupInputListener(fromDate, toDate, setSchedule);

        if (count === 0)
            prevBtnElement.disabled = true;
    })
}