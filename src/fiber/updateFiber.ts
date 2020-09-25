import type {Fiber} from 'react-reconciler';

/**
 * Update the indices of a fiber and its siblings.
 * Return the last sibling index.
 *
 * @param fiber   - The fiber.
 * @param index   - The index of the fiber.
 * @returns       - The last sibling index.
 */
export function updateFibersIndex(fiber: Fiber, index: number): number {
  while (fiber) {
    fiber.index = index;
    (fiber as Fiber | null) = fiber.sibling;
    index += 1;
  }

  return index - 1;
}
