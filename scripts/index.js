import { controlButtons } from "./controlButtons.js";
import { currentWeek } from "./currentWeek.js";
import { groupInputListener, groupStorage } from "./groupStorage.js";
import { scrollToSubject } from "./scrollToSubject.js";
import { setSchedule } from "./setSchedule.js";
import { getDateInformation } from "./utils/getDateInformation.js";

document.addEventListener("DOMContentLoaded", () => {
    const { fromDate, toDate } = getDateInformation(0);
    groupStorage(fromDate, toDate, setSchedule);
    groupInputListener(fromDate, toDate, setSchedule);
    scrollToSubject();
    controlButtons();
    currentWeek({ fromDate, toDate});
});

