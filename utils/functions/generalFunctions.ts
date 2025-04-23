import { CorrectionDataType } from '@/types/types';

export function sortCorrectionDataChronologically(
  correctionData: CorrectionDataType[]
) {
  return correctionData?.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export const capitalizeFirstLetter = (str: string): string =>
  str.charAt(0).toUpperCase() + str.slice(1);

export function formatToLocalDate({
  dateTimeString,
}: {
  dateTimeString: string;
}): Date {
  return new Date(`${dateTimeString}Z`);
}

export function formatTime({
  dateTimeString,
}: {
  dateTimeString: string;
}): string {
  const date = formatToLocalDate({ dateTimeString });

  if (isNaN(date.getTime())) {
    throw new Error('Invalid date format');
  }

  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  }).format(date);
}

export function formatDate({
  dateTimeString,
  fancy = false,
}: {
  dateTimeString: string;
  fancy?: boolean;
}): string {
  const date = formatToLocalDate({ dateTimeString });

  if (isNaN(date.getTime())) {
    throw new Error('Invalid date format');
  }

  const day = date.getDate();
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

  if (fancy) {
    // Fancy: "Tuesday, April 22nd, 2025"
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
      .format(date)
      .replace(/\d+/, `${day}${suffix}`);
  } else {
    // regular: "April 22, 2025"
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  }
}

export function getConversationTitle({
  dateTimeString,
}: {
  dateTimeString: string;
}): string {
  const date = new Date(`${dateTimeString}Z`);

  if (isNaN(date.getTime())) {
    throw new Error('Invalid timestamp');
  }

  const hour = date.getHours();

  if (hour >= 0 && hour < 12) {
    return 'Morning Conversation';
  } else if (hour >= 12 && hour < 18) {
    return 'Afternoon Conversation';
  } else {
    return 'Evening Conversation';
  }
}
