/**
 * Throw an error if the condition fails.
 *
 * @param condition - The condition.
 * @param message   - The error message.
 */
export function invariant(
  condition: boolean,
  message: string
): asserts condition {
  if (!condition) {
    throw new Error(`Invariant failed: ${message}`);
  }
}
