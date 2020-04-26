import type {Fiber} from 'react-reconciler'; // eslint-disable-line
import {findChildFiberAt, findPreviousFiber} from './findFiber';
import {updateFibersIndices} from './updateFiber';
import {warning} from '../warning';

/**
 * Remove the child fiber at the given index and return it or null if it not exists.
 *
 * @param parent - The parent fiber.
 * @param index - The index of the fiber.
 * @param skipUpdate - Whether to skip updating computed properties.
 * @returns - The removed fiber or null.
 */
export function removeChildFiberAt(
  parent: Fiber,
  index: number,
  skipUpdate?: boolean
): Fiber | null {
  // The warnings are removed in production.
  warning(
    index >= 0,
    `The index provided to find the fiber must be >= of 0, found '${index}'`
  );

  // Invalid index.
  if (index < 0) return null;

  // Remove the first child fiber.
  if (index === 0) return removeFirstChildFiber(parent, skipUpdate);

  // Find the previous fiber.
  // At this point we are shure that index > 0.
  const previousFiber = findChildFiberAt(parent, index - 1);

  // The warnings are removed in production.
  warning(
    previousFiber !== null,
    `Cannot find and remove the fiber at index: '${index}'`
  );

  // If the fiber is not found.
  if (previousFiber === null) return null;

  // Remove the sibling.
  return removeSiblingFiber(previousFiber, skipUpdate);
}

/**
 * Remove the child fiber with the given key and return it or null if it not exists.
 *
 * @param parent - The parent fiber.
 * @param key - The key of the fiber.
 * @param skipUpdate - Whether to skip updating computed properties.
 * @returns - The removed fiber or null.
 */
export function removeChildFiber(
  parent: Fiber,
  key: string,
  skipUpdate?: boolean
): Fiber | null {
  // Find the previous fiber.
  const previousFiber = findPreviousFiber(parent, key);

  // The warnings are removed in production.
  warning(
    previousFiber !== null,
    `No fiber with the key: '${key}' has been found, the fiber cannot be removed`
  );

  // If the fiber is not found.
  if (previousFiber === null) return null;

  // If The fiber with the given key is the first one.
  if (previousFiber === parent)
    return removeFirstChildFiber(parent, skipUpdate);

  // Add the fiber as sibling of the previous one.
  return removeSiblingFiber(previousFiber, skipUpdate);
}

/**
 * Remove the next sibling from a fiber and return it or null if it not exist.
 *
 * @param fiber - The fiber.
 * @param skipUpdate - Whether to skip updating computed properties.
 * @returns - The removed sibling or null.
 */
export function removeSiblingFiber(
  fiber: Fiber,
  skipUpdate?: boolean
): Fiber | null {
  const removed = fiber.sibling;

  // If the fiber has no sibling return null.
  if (removed === null) return null;

  // Update fiber references.
  fiber.sibling = removed.sibling;
  removed.return = null;
  removed.sibling = null;

  // Update computed fiber properties.
  if (!skipUpdate) {
    updateFibersIndices(fiber, fiber.index);
  }

  return removed;
}

/**
 * Remove the first child fiber of the given parent and return it or null if it not exists.
 *
 * @param parent - The parent fiber.
 * @param skipUpdate - Whether to skip updating computed properties.
 * @returns - The removed fiber or null.
 */
export function removeFirstChildFiber(
  parent: Fiber,
  skipUpdate?: boolean
): Fiber | null {
  const removed = parent.child;

  // If the parent has no children return null.
  if (removed === null) return null;

  // Update the child
  parent.child = removed.sibling;
  removed.return = null;
  removed.sibling = null;

  // Update computed fiber properties.
  if (!skipUpdate) {
    updateFibersIndices(parent.child, 0);
  }

  return removed;
}
