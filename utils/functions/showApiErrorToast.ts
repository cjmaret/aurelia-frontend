export function showApiErrorToast({
  error,
  showToast,
  t,
}: {
  error: any;
  showToast: (
    type: 'error' | 'info' | 'success',
    text1: string,
    text2?: string
  ) => void;
  t: (key: string, options?: any) => string;
}): void {
  const { status = 0, message = 'Unknown Error' } = error;

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
