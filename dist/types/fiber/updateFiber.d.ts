import type { Fiber } from 'react-reconciler';
/**
 * Update the indices of a fiber and its siblings.
 * Return the last sibling index.
 *
 * @param fiber   - The fiber.
 * @param index   - The index of the fiber.
 * @returns       - The last sibling index.
 */
export declare function updateFibersIndex(fiber: Fiber, index: number): number;
