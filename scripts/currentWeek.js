export function currentWeek(date) {
    const currentWeekElement = document.querySelector('.currentWeek');
    const { fromDate, toDate } = date;
    const formatedFromDate = fromDate.split('-');
    const formatedToDate = toDate.split('-');
    const fromDateDay = formatedFromDate[2];
    const fromDateMonth = formatedFromDate[1];
    const fromDateMonthWord = Intl.DateTimeFormat('ru-RU', { month: 'short' }).format(new Date(`${formatedFromDate[0]}-${formatedFromDate[1]}-${formatedFromDate[2]}`));
    const toDateDay = formatedToDate[2];
    const toDateMonth = formatedToDate[1];
    const toDateMonthWord = Intl.DateTimeFormat('ru-RU', { month: 'short' }).format(new Date(`${formatedToDate[0]}-${formatedToDate[1]}-${formatedToDate[2]}`));
    const from = `${fromDateDay} ${fromDateMonthWord}`;
    const to = `${toDateDay} ${toDateMonthWord}`;
    currentWeekElement.innerHTML = `${from} - ${to}`;
}