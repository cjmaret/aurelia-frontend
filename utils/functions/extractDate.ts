export function extractDate(dateTimeString: string): string {
  const date = new Date(dateTimeString);

  if (isNaN(date.getTime())) {
    throw new Error('Invalid date format');
  }

  const day = date.getUTCDate();
  const suffix = (() => {
    if (day >= 11 && day <= 13) return 'th';
    switch (day % 10) {
      case 1:
        return 'st';
      case 2:
        return 'nd';
      case 3:
        return 'rd';
      default:
        return 'th';
    }
  })();

  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  })
    .format(date)
    .replace(/\d+/, `${day}${suffix}`);
}
