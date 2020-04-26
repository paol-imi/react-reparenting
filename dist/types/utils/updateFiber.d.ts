import type { Fiber } from 'react-reconciler';
/**
 * Update the indices of a fiber and its next siblings.
 *
 * @param fiber - The fiber.
 * @param index - The index of the fiber.
 */
export declare function updateFibersIndices(fiber: Fiber | null, index: number): void;
/**
 * Update the debug owner.
 * I have not yet inquired about how the _debugOwner is chosen.
 * For now it is updated only if there is at least one sibling from which to copy this property.
 * This method is removed in production.
 *
 * @param child - The child fiber.
 * @param parent - The parent fiber.
 */
export declare function updateFiberDebugOwner(child: Fiber, parent: Fiber | null): void;
