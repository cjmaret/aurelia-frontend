export function produceApiErrorAlert({
  status,
  message,
  showToast,
  t,
}: {
  status: number;
  message: string;
  showToast: (
    type: 'error' | 'info' | 'success',
    text1: string,
    text2?: string
  ) => void;
  t: (key: string, options?: any) => string;
}): void {
  console.error(`API Error - Status: ${status}, Message: ${message}`);

  if (status === 422) {
    showToast('error', t('error'), t('noSpeechDetectedError'));
  } else if (status === 401) {
    showToast('error', t('error'), t('sessionExpiredError'));
  } else if (status >= 500) {
    showToast('error', t('error'), t('serverError'));
  } else {
    showToast('error', t('error'), t('unexpectedError'));
  }
}
