import type { Fiber } from 'react-reconciler';
/**
 * Add a child fiber in a parent fiber at the given index and return the actual
 * index in which it is added.
 * If the index is -1 the fiber is added at the bottom.
 * If the index provided is greater than the number of children available the
 * fiber is added at the bottom.
 *
 * @param parent  - The parent fiber in which to add the child fiber.
 * @param child   - The child fiber to add.
 * @param index   - The index in which to add the fiber.
 * @returns       - The index in which the child fiber is added.
 */
export declare function addChildFiberAt(parent: Fiber, child: Fiber, index: number): number;
/**
 * Add a child fiber in a parent fiber before the child fiber with the given
 * key and return the index in which it is added.
 * If the key is not found the fiber is added at the bottom.
 *
 * @param parent  - The parent fiber in which to add the child fiber.
 * @param child   - The child fiber to add.
 * @param key     - The key of the previous child fiber.
 * @returns       - The index in which the child fiber is added.
 */
export declare function addChildFiberBefore(parent: Fiber, child: Fiber, key: string): number;
/**
 * Add a child fiber at the bottom and return the index in which it is added.
 *
 * @param parent  - The parent fiber in which to add the child fiber.
 * @param child   - The child fiber to add.
 * @returns       - The index in which the fiber is added.
 */
export declare function appendChildFiber(parent: Fiber, child: Fiber): number;
/**
 * Add a sibling fiber after a fiber and return the index in which it is added.
 *
 * @param fiber   - The fiber.
 * @param sibling - The sibling fiber to add.
 * @returns       - The index in which the sibling fiber is added.
 */
export declare function addSiblingFiber(fiber: Fiber, sibling: Fiber): number;
/**
 * Add a child fiber at the beginning child and retun 0.
 *
 * @param parent  - The parent fiber.
 * @param child   - The child fiber.
 * @returns       - The index in which the fiber is added.
 */
export declare function prependChildFiber(parent: Fiber, child: Fiber): number;
