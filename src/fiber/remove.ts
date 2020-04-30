import type {Fiber} from 'react-reconciler';
import {findChildFiberAt, findPreviousFiber} from './find';
import {warning} from '../warning';
import {invariant} from '../invariant';

/**
 * Remove the child fiber at the given index and return it or null if it not exists.
 *
 * @param parent - The parent fiber.
 * @param index - The index of the child fiber to remove.
 * @returns - The removed fiber or null.
 */
export function removeChildFiberAt(parent: Fiber, index: number): Fiber | null {
  invariant(
    index >= 0,
    `The index provided to find the child must be >= 0, found: ${index}`
  );

  // Remove the first child fiber.
  if (index === 0) {
    return removeFirstChildFiber(parent);
  }

  // Find the previous fiber.
  // At this point we are shure that index > 0.
  const previousFiber = findChildFiberAt(parent, index - 1);

  // If the fiber is not found.
  if (previousFiber === null) {
    if (__DEV__) {
      warning(`Cannot find and remove the child at index: ${index}`);
    }

    return null;
  }

  // Remove the sibling.
  return removeSiblingFiber(previousFiber);
}

/**
 * Remove the child fiber with the given key and return it or null if it not exists.
 *
 * @param parent - The parent fiber.
 * @param key - The key of the child fiber to remove.
 * @returns - The removed fiber or null.
 */
export function removeChildFiber(parent: Fiber, key: string): Fiber | null {
  // Find the previous fiber.
  const previousFiber = findPreviousFiber(parent, key);

  // If the fiber is not found.
  if (previousFiber === null) {
    if (__DEV__) {
      warning(
        `No child with the key: '${key}' has been found, the child cannot be removed`
      );
    }
    return null;
  }

  // If The fiber with the given key is the first one.
  if (previousFiber === parent) {
    return removeFirstChildFiber(parent);
  }

  // Add the fiber as sibling of the previous one.
  return removeSiblingFiber(previousFiber);
}

/**
 * Remove the next sibling from a fiber and return it or null if it not exist.
 *
 * @param fiber - The fiber.
 * @returns - The removed sibling fiber or null.
 */
export function removeSiblingFiber(fiber: Fiber): Fiber | null {
  const removed = fiber.sibling;

  // If the fiber has no sibling return null.
  if (removed === null) {
    if (__DEV__) {
      warning('The child has no sibling');
    }

    return null;
  }

  // Update fiber references.
  fiber.sibling = removed.sibling;

  return removed;
}

/**
 * Remove the first child fiber of the given parent and return it or null if it not exists.
 *
 * @param parent - The parent fiber.
 * @returns - The removed child fiber or null.
 */
export function removeFirstChildFiber(parent: Fiber): Fiber | null {
  const removed = parent.child;

  // If the parent has no children return null.
  if (removed === null) {
    if (__DEV__) {
      warning('The parent has no children');
    }

    return null;
  }

  // Update fiber references.
  parent.child = removed.sibling;

  return removed;
}
