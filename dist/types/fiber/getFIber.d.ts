import type { Fiber } from 'react-reconciler';
/**
 * Return the first valid fiber or null.
 *
 * @param fiber - The fiber to start looking for.
 * @param next  - The callback to get the next fiber to iterate.
 * @param stop  - The callback to check if the fiber is found.
 * @returns     - The found fiber or null.
 */
export declare function getFiberFromPath(fiber: Fiber | null, next: (fiber: Fiber) => Fiber | null, stop: (fiber: Fiber) => boolean): Fiber | null;
