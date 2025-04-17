export function formatDateTime(dateTimeString) {
  
  const date = new Date(dateTimeString);

  if (isNaN(date.getTime())) {
    throw new Error('Invalid date format');
  }

  const timeOptions = {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
    timeZone: 'UTC',
  };
  const formattedTime = new Intl.DateTimeFormat('en-US', timeOptions).format(
    date
  );

  const dateOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  };
  const formattedDate = new Intl.DateTimeFormat('en-US', dateOptions).format(
    date
  );

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

  const timeZoneAbbr = 'UTC';

  return `${formattedTime} (${timeZoneAbbr}) ${formattedDate.split(',')[0]}, ${
    formattedDate.split(' ')[1]
  } ${day}${suffix}, ${date.getUTCFullYear()}`;
}
