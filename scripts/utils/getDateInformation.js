export function getDateInformation(number) {
    const current = new Date()
    const dayOffset = number * 7;
    const firstDay = new Date(new Date().setUTCDate(current.getUTCDate() - current.getUTCDay() + 1 + dayOffset));
    const lastDay = new Date(new Date().setUTCDate(current.getUTCDate() - current.getUTCDay() + 7 + dayOffset));
    const fromDate = `${firstDay.toISOString().substring(0, 10)}`;
    const toDate = `${lastDay.toISOString().substring(0, 10)}`;    
    return { fromDate, toDate };
}
