import type {Fiber} from 'react-reconciler';

/**
 * Update the indices of a fiber and its next siblings.
 *
 * @param fiber - The fiber.
 * @param index - The index of the fiber.
 * @returns - The last sibling index.
 */
export function updateFibersIndices(fiber: Fiber, index: number): number {
  while (fiber) {
    fiber.index = index;
    (fiber as Fiber | null) = fiber.sibling;
    index += 1;
  }

  return index - 1;
}

/**
 * Update the debug owner.
 * I have not yet inquired about how the _debug fields are chosen.
 * For now only the debug owner and source if there is at least one sibling from which to copy those properties.
 * TODO:
 * - _debugID - does it need to be changed?
 * - _debugSource - is it ok like this?
 * - _debugOwner - is it ok like this?
 * - _debugHookTypes - does it need to be changed?
 *
 * @param child - The child fiber.
 * @param parent - The parent fiber.
 */
export function updateFiberDebugFields(child: Fiber, parent: Fiber): void {
  let fiberToCopy;

  // Try to find a sibling.
  if (parent.child === child && child.sibling !== null) {
    fiberToCopy = child.sibling;
  } else if (parent.child !== null) {
    fiberToCopy = parent.child;
  } else {
    fiberToCopy = parent;
  }

  child._debugOwner = fiberToCopy._debugOwner;
  child._debugSource = fiberToCopy._debugSource;
}
