import type { Fiber } from 'react-reconciler';
/**
 * Return the child fiber at the given index or null if the parent has no children.
 * If the index provided is greater than the number of children the last child is returned.
 *
 * @param parent  - The parent fiber.
 * @param index   - The index of the child fiber to find.
 * @returns       - The child fiber found or null.
 */
export declare function findChildFiberAt(parent: Fiber, index: number): Fiber | null;
/**
 * Return the child fiber with the given key or null if it is not found.
 *
 * @param parent  - The parent fiber.
 * @param key     - The key of the child fiber to find.
 * @returns       - The child fiber found or null.
 */
export declare function findChildFiber(parent: Fiber, key: string): Fiber | null;
/**
 * Return the fiber before the one with the given key or null if it is not found.
 * If the fiber with the given key is the first child of the parent, the parent is returned.
 *
 * @param parent  - The parent fiber.
 * @param key     - The key of the child fiber.
 * @returns       - The fiber found or null.
 */
export declare function findPreviousFiber(parent: Fiber, key: string): Fiber | null;
/**
 * Return the child fiber with the given key or null if it is not found.
 *
 * @param parent  - The parent fiber.
 * @param key     - The key of the child fiber to find.
 * @returns       - The fiber found or null.
 */
export declare function findSiblingFiber(fiber: Fiber, key: string): Fiber | null;
