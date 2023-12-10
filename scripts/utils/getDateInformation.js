export function getDateInformation(number) {
    const current = new Date(new Date().toUTCString());
    const daysToShift = 7 * number;
    const firstDay = new Date(current.setUTCDate(current.getUTCDate() - current.getUTCDay() + 1 + daysToShift));
    const lastDay = new Date(current.setUTCDate(current.getUTCDate() - current.getUTCDay() + 7 + daysToShift));
    const fromDate = `${firstDay.toISOString().substring(0, 10)}`;
    const toDate = `${lastDay.toISOString().substring(0, 10)}`;
    return { fromDate, toDate };
}