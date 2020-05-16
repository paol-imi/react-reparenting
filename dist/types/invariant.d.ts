export declare class Invariant extends Error {
    name: string;
}
/**
 * Throw an error if the condition fails.
 * The message is tripped in production.
 *
 * @param condition - The condition.
 * @param message   - The error message.
 */
export declare function invariant(condition: boolean, message?: string): asserts condition;
