export function extractTime(dateTimeString: string): string {
  const date = new Date(dateTimeString);

  if (isNaN(date.getTime())) {
    throw new Error('Invalid date format');
  }

  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  }).format(date); 
}
