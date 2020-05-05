/**
 * Prints a warning in the console.
 *
 * @param message - The warning message.
 */
export function warning(message: string): void {
  // Condition not passed.
  const text = `Warning: ${message}`;

  // Check console for IE9 support which provides console
  // only with open devtools.
  if (typeof console !== 'undefined') {
    // eslint-disable-next-line no-console
    console.error(text);
  }

  // Throwing an error and catching it immediately
  // to improve debugging.
  // A consumer can use 'pause on caught exceptions'
  // https://github.com/facebook/react/issues/4216
  try {
    throw Error(text);
  } catch (x) {} // eslint-disable-line no-empty
}
