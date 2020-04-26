import type { Fiber } from 'react-reconciler';
/**
 * Remove the child fiber at the given index and return it or null if it not exists.
 *
 * @param parent - The parent fiber.
 * @param index - The index of the fiber.
 * @param skipUpdate - Whether to skip updating computed properties.
 * @returns - The removed fiber or null.
 */
export declare function removeChildFiberAt(parent: Fiber, index: number, skipUpdate?: boolean): Fiber | null;
/**
 * Remove the child fiber with the given key and return it or null if it not exists.
 *
 * @param parent - The parent fiber.
 * @param key - The key of the fiber.
 * @param skipUpdate - Whether to skip updating computed properties.
 * @returns - The removed fiber or null.
 */
export declare function removeChildFiber(parent: Fiber, key: string, skipUpdate?: boolean): Fiber | null;
/**
 * Remove the next sibling from a fiber and return it or null if it not exist.
 *
 * @param fiber - The fiber.
 * @param skipUpdate - Whether to skip updating computed properties.
 * @returns - The removed sibling or null.
 */
export declare function removeSiblingFiber(fiber: Fiber, skipUpdate?: boolean): Fiber | null;
/**
 * Remove the first child fiber of the given parent and return it or null if it not exists.
 *
 * @param parent - The parent fiber.
 * @param skipUpdate - Whether to skip updating computed properties.
 * @returns - The removed fiber or null.
 */
export declare function removeFirstChildFiber(parent: Fiber, skipUpdate?: boolean): Fiber | null;
