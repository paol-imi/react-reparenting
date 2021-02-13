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
/**
 * Update the debug fields.
 * I have not yet inquired about how the _debug fields are chosen.
 * For now only the owner and source are set based on the siblings/parent fields.
 *
 * @param child   - The child fiber.
 * @param parent  - The parent fiber.
 */
export declare function updateFiberDebugFields(child: Fiber, parent: Fiber): void;
