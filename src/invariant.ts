const prefix = 'Invariant failed';

// Invariant error instance.
export class Invariant extends Error {
  name = 'Invariant';
}

/**
 * Throw an error if the condition fails.
 * The message is tripped in production.
 *
 * @param condition - The condition.
 * @param message - The error message.
 */
export function invariant(
  condition: boolean,
  message?: string
): asserts condition {
  if (condition) return;

  if (__DEV__) {
    // When not in production we allow the message to pass through.
    throw new Invariant(`${prefix}: ${message || ''}`);
  } else {
    // In production we strip the message but still throw.
    throw new Invariant(prefix);
  }
}
