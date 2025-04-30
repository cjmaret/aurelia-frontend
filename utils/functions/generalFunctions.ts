export function formatToLocalDate({
  dateTimeString,
}: {
  dateTimeString: string;
}): Date {
  return new Date(`${dateTimeString}Z`);
}

export function formatTime({
  dateTimeString,
  locale = 'en-US',
}: {
  dateTimeString: string;
  locale?: string;
}): string {
  const date = formatToLocalDate({ dateTimeString });

  if (isNaN(date.getTime())) {
    throw new Error('Invalid date format');
  }

  return new Intl.DateTimeFormat(locale, {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  }).format(date);
}

export function formatDate({
  dateTimeString,
  locale = 'en-US',
  fancy = false,
}: {
  dateTimeString: string;
  locale?: string;
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
    return new Intl.DateTimeFormat(locale, {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
      .format(date)
      .replace(/\d+/, `${day}${suffix}`);
  } else {
    // regular: "April 22, 2025"
    return new Intl.DateTimeFormat(locale, {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  }
}

export function getConversationTitle({
  dateTimeString,
  t,
}: {
  dateTimeString: string;
  t: (key: string) => string;
}): string {
  const date = new Date(`${dateTimeString}Z`);

  if (isNaN(date.getTime())) {
    throw new Error('Invalid timestamp');
  }

  const hour = date.getHours();

  if (hour >= 0 && hour < 12) {
    return t('morningConversation');
  } else if (hour >= 12 && hour < 18) {
    return t('afternoonConversation');
  } else {
    return t('nightConversation');
  }
}

export function getTranslatedLanguageName({
  code,
  t,
}: {
  code: string;
  t: (key: string) => string;
}) {
  const languageKeys: Record<string, string> = {
    en: 'english',
    es: 'spanish',
    fr: 'french',
  };
  return t(languageKeys[code]);
}
