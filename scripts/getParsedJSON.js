import { days } from "./constants/index.js"

export function getParsedJSON(json) {
    const dates = [];

    json.forEach((subject) => {
        const day = new Date(subject.timestart * 1000).getDay();
        if (dates.indexOf(days[day]) !== -1)
            return;

        else
            dates.push(days[day]);
    });

    const newDates = dates.map((oldDate) => {
        let subjects = json.map(subject => {
            const day = new Date(subject.timestart * 1000).getDay();
            if (days[day] === oldDate)
                return subject;
        });

        subjects = subjects.filter(Boolean);

        return { date: oldDate, subjects };
    });

    return newDates;
}
