export function produceApiErrorAlert(status: number, message: string): void {
  console.error(`API Error - Status: ${status}, Message: ${message}`);

  if (status === 422) {
    alert('No speech detected. Please record your voice and try again.');
  } else if (status === 401) {
    alert('Your session has expired. Please log in again.');
  } else if (status >= 500) {
    alert('A server error occurred. Please try again later.');
  } else {
    alert(`An unexpected error occurred: ${message}`);
  }
}
