import type {Fiber} from 'react-reconciler'; // eslint-disable-line

/**
 * Update the indices of a fiber and its next siblings.
 *
 * @param fiber - The fiber.
 * @param index - The index of the fiber.
 */
export function updateFibersIndices(fiber: Fiber | null, index: number): void {
  while (fiber) {
    fiber.index = index;
    fiber = fiber.sibling;
    index += 1;
  }
}

/**
 * Update the debug owner.
 * I have not yet inquired about how the _debugOwner is chosen.
 * For now it is updated only if there is at least one sibling from which to copy this property.
 * This method is removed in production.
 *
 * @param child - The child fiber.
 * @param parent - The parent fiber.
 */
export function updateFiberDebugOwner(
  child: Fiber,
  parent: Fiber | null
): void {
  if (parent === null) return;
  // Try to find a sibling with the debug owner.
  if (parent.child === child) {
    const {sibling} = child;
    if (sibling !== null) {
      child._debugOwner = sibling._debugOwner;
    }
  } else {
    child._debugOwner = parent.child && parent.child._debugOwner;
  }
}
