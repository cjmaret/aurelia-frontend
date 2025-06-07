import i18n from '@/utils/app-language-wrapper/i18n';

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

  return new Intl.DateTimeFormat(undefined, {
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

  const userLocale = i18n.language || 'en';

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
    return new Intl.DateTimeFormat(userLocale, {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
      .format(date)
      .replace(/\d+/, `${day}${suffix}`);
  } else {
    // regular: "April 22, 2025"
    return new Intl.DateTimeFormat(userLocale, {
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
    return t('eveningConversation');
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

export function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}