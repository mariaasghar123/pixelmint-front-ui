export function formatDateTime(iso) {
    if (!iso) return { date: "-", time: "-" };
    const d = new Date(iso);
    const date = d.toLocaleDateString();
    const time = d.toLocaleTimeString();
    return { date, time };
}
