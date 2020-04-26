/**
 * Prints a warning in the console if the condition fails.
 *
 * @param condition - The condition.
 * @param message - The message.
 */
export function warning(condition: boolean, message: string): void {
  // condition passed: do not log.
  if (condition) {
    return;
  }

  // Condition not passed.
  const text = `Warning: ${message}`;

  // check console for IE9 support which provides console
  // only with open devtools.
  if (typeof console !== 'undefined') {
    // eslint-disable-next-line
    console.error(text);
  }

  // Throwing an error and catching it immediately
  // to improve debugging.
  // A consumer can use 'pause on caught exceptions'
  // https://github.com/facebook/react/issues/4216
  try {
    throw Error(text);
  } catch (x) {} // eslint-disable-line
}
