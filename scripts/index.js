import { groupInputListener, groupStorage } from "./groupStorage.js";
import { scrollToSubject } from "./scrollToSubject.js";
import { getDateInformation } from "./utils/getDateInformation.js"
import { setSchedule } from "./setSchedule.js";

document.addEventListener("DOMContentLoaded", () => {
    const { fromDate, toDate } = getDateInformation();
    groupStorage(fromDate, toDate, setSchedule);
    groupInputListener(fromDate, toDate, setSchedule);
    scrollToSubject();
});

