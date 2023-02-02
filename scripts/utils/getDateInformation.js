export function getDateInformation() {
    const current = new Date(new Date().toUTCString());
    const firstDay = new Date(current.setUTCDate(current.getUTCDate() - current.getUTCDay() + 1));
    const lastDay = new Date(current.setUTCDate(current.getUTCDate() - current.getUTCDay() + 7));
    const fromDate = `${firstDay.toISOString().substring(0, 10)}`;
    const toDate = `${lastDay.toISOString().substring(0, 10)}`;
    return { fromDate, toDate };
}
