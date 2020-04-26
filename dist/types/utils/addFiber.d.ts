import type { Fiber } from 'react-reconciler';
/**
 * Add a child fiber in the parent at the given index.
 * If index is -1 the fiber is added at the bottom.
 * If the index provided is greater than the number of children available
 * the fiber is added at the bottom.
 *
 * @param parent - The parent fiber.
 * @param child - The child fiber.
 * @param index - The index in which to add the fiber.
 * @param skipUpdate - Whether to skip updating computed properties.
 * @returns - The index in which the fiber is added.
 */
export declare function addChildFiberAt(parent: Fiber, child: Fiber, index: number, skipUpdate?: boolean): number;
/**
 * Add the child fiber in the parent before the fiber with the given key.
 * If the key is not found the fiber is added at the bottom.
 *
 * @param parent - The parent fiber.
 * @param child - The child fiber.
 * @param key - The key of the previous fiber.
 * @param skipUpdate - Whether to skip updating computed properties.
 * @returns - The index in which the fiber is added.
 */
export declare function addChildFiberBefore(parent: Fiber, child: Fiber, key: string, skipUpdate?: boolean): number;
/**
 * Add the fiber at the bottom.
 *
 * @param parent - The parent fiber.
 * @param child - The child fiber.
 * @param skipUpdate - Whether to skip updating computed properties.
 * @returns - The index in which the fiber is added.
 */
export declare function appendChildFiber(parent: Fiber, child: Fiber, skipUpdate?: boolean): number;
/**
 * Add the fiber after the given sibling fiber.
 *
 * @param fiber - The fiber.
 * @param sibling - The fiber to add as sibling.
 * @param skipUpdate - Whether to skip updating computed properties.
 * @returns - The index in which the fiber is added.
 */
export declare function addSiblingFiber(fiber: Fiber, sibling: Fiber, skipUpdate?: boolean): number;
/**
 * Add the fiber as first child.
 *
 * @param parent - The parent fiber.
 * @param child - The child fiber.
 * @returns - The index in which the fiber is added.
 */
export declare function prependChildFiber(parent: Fiber, child: Fiber, skipUpdate?: boolean): number;
