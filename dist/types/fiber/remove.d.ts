import type { Fiber } from 'react-reconciler';
/**
 * Remove the child fiber at the given index and return it or null if it not exists.
 *
 * @param parent  - The parent fiber.
 * @param index   - The index of the child fiber to remove.
 * @returns       - The removed fiber or null.
 */
export declare function removeChildFiberAt(parent: Fiber, index: number): Fiber | null;
/**
 * Remove the child fiber with the given key and return it or null if it not exists.
 *
 * @param parent  - The parent fiber.
 * @param key     - The key of the child fiber to remove.
 * @returns       - The removed fiber or null.
 */
export declare function removeChildFiber(parent: Fiber, key: string): Fiber | null;
/**
 * Remove the first child fiber of the given parent and return it or null if it not exists.
 *
 * @param parent  - The parent fiber.
 * @returns       - The removed child fiber or null.
 */
export declare function removeFirstChildFiber(parent: Fiber): Fiber | null;
/**
 * Remove the next sibling from a fiber and return it or null if it not exist.
 *
 * @param fiber - The fiber.
 * @returns     - The removed sibling fiber or null.
 */
export declare function removeSiblingFiber(fiber: Fiber): Fiber | null;
