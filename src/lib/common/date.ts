export const formatDate = (date: string) => {
    const createdAtDate = new Date(date);
    const day = String(createdAtDate.getDate()).padStart(2, '0');
    const month = String(createdAtDate.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed!
    const year = createdAtDate.getFullYear();

    const hours = String(createdAtDate.getHours()).padStart(2, '0');
    const minutes = String(createdAtDate.getMinutes()).padStart(2, '0');

    return `${day}.${month}.${year} ${hours}:${minutes}`;
}