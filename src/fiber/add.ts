import type {Fiber} from 'react-reconciler';
import {findChildFiberAt, findPreviousFiber} from './find';
import {warning} from '../warning';

/**
 * Add a child fiber in the parent at the given index and return its index.
 * If the index is -1 the fiber is added at the bottom.
 * If the index provided is greater than the number of children available the fiber is added at the bottom.
 *
 * @param parent - The parent fiber.
 * @param child - The child fiber.
 * @param index - The index in which to add the fiber.
 * @returns - The index in which the fiber is added.
 */
export function addChildFiberAt(
  parent: Fiber,
  child: Fiber,
  index: number
): number {
  // If the fiber is not found add the fiber at the bottom.
  if (index === -1) return appendChildFiber(parent, child);
  // Add the fiber in the first index.
  if (index === 0) return prependChildFiber(parent, child);

  // Find the previous sibling.
  // At this point we are sure that the index is greater than 0.
  const previousSibling = findChildFiberAt(parent, index - 1);

  // If the fiber is not found add the fiber at the bottom.
  if (previousSibling === null) {
    if (__DEV__) {
      warning(
        `The parent has no children, the child is added as the only child`
      );
    }

    return appendChildFiber(parent, child);
  }

  if (__DEV__) {
    if (previousSibling.index !== index - 1) {
      warning(
        `The child cannot be added at index: '${index}', the child is added at the bottom. Its index is ${
          previousSibling.index + 1
        }`
      );
    }
  }

  // Add the fiber as sibling of the previous one.
  return addSiblingFiber(previousSibling, child);
}

/**
 * Add the child fiber in the parent before the fiber with the given key and return its index.
 * If the key is not found the fiber is added at the bottom.
 *
 * @param parent - The parent fiber.
 * @param child - The child fiber.
 * @param key - The key of the previous fiber.
 * @returns - The index in which the fiber is added.
 */
export function addChildFiberBefore(
  parent: Fiber,
  child: Fiber,
  key: string
): number {
  // Find the previous fiber.
  const previousFiber = findPreviousFiber(parent, key);

  // If the fiber is not found add the fiber at the bottom.
  if (previousFiber === null) {
    if (__DEV__) {
      warning(
        `No child with the key: '${key}' has been found, the child is added at the bottom`
      );
    }

    return appendChildFiber(parent, child);
  }

  // If The fiber with the given key is the first one.
  if (previousFiber === parent) {
    return prependChildFiber(parent, child);
  }

  // Add the fiber as sibling of the previous one.
  return addSiblingFiber(previousFiber, child);
}

/**
 * Add the fiber at the bottom and return its index.
 *
 * @param parent - The parent fiber.
 * @param child - The child fiber.
 * @returns - The index in which the fiber is added.
 */
export function appendChildFiber(parent: Fiber, child: Fiber): number {
  const previousFiber = findChildFiberAt(parent, -1);

  // The parent has no children.
  if (previousFiber === null) {
    return prependChildFiber(parent, child);
  }

  return addSiblingFiber(previousFiber, child);
}

/**
 * Add the fiber after the given sibling and return its index.
 *
 * @param fiber - The fiber.
 * @param sibling - The fiber to add as sibling.
 * @returns - The index in which the fiber is added.
 */
export function addSiblingFiber(fiber: Fiber, sibling: Fiber): number {
  const oldSibling = fiber.sibling;
  const index = fiber.index + 1;

  // Update fiber references.
  fiber.sibling = sibling;
  sibling.sibling = oldSibling;
  sibling.return = fiber.return;

  return index;
}

/**
 * Add the fiber as first child and retun 0.
 *
 * @param parent - The parent fiber.
 * @param child - The child fiber.
 * @returns - The index in which the fiber is added.
 */
export function prependChildFiber(parent: Fiber, child: Fiber): number {
  const oldFirstChild = parent.child;

  // Update fiber references.
  parent.child = child;
  child.sibling = oldFirstChild;
  child.return = parent;

  return 0;
}
