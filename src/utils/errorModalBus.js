let handler = null;

export function setErrorModalHandler(fn) {
  handler = fn;
}

export function publishApiError(error) {
  if (handler) handler(error);
}
