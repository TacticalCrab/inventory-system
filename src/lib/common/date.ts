export const formatDate = (date: string) => {
    const createdAtDate = new Date(date);
    const day = String(createdAtDate.getDate()).padStart(2, '0');
    const month = String(createdAtDate.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed!
    const year = createdAtDate.getFullYear();

    const hours = String(createdAtDate.getHours()).padStart(2, '0');
    const minutes = String(createdAtDate.getMinutes()).padStart(2, '0');

    return `${day}.${month}.${year} ${hours}:${minutes}`;
}

export function isDate(value: string): boolean {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);

  if (!match) return false;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  const date = new Date(Date.UTC(year, month - 1, day));

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

export function compareDates(
	a: string | Date | null | undefined,
	b: string | Date | null | undefined
): number {
	const aTime = a ? new Date(a).getTime() : Number.POSITIVE_INFINITY;
	const bTime = b ? new Date(b).getTime() : Number.POSITIVE_INFINITY;

	return aTime - bTime;
}