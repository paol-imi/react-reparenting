import type {Fiber} from 'react-reconciler';
import {findChildFiberAt, findPreviousFiber} from './findFIber';

/**
 * Add a child fiber in a parent fiber at the given index and return the actual
 * index in which it is added.
 * If the index is -1 the fiber is added at the bottom.
 * If the index provided is greater than the number of children available the
 * fiber is added at the bottom.
 *
 * @param parent  - The parent fiber in which to add the child fiber.
 * @param child   - The child fiber to add.
 * @param index   - The index in which to add the fiber.
 * @returns       - The index in which the child fiber is added.
 */
export function addChildFiberAt(
  parent: Fiber,
  child: Fiber,
  index: number
): number {
  // Add the fiber at the bottom.
  if (index === -1) return appendChildFiber(parent, child);
  // Add the fiber at the beginning.
  if (index === 0) return prependChildFiber(parent, child);

  // Find the previous sibling.
  // At this point we are sure that the index is greater than 0.
  const previousSibling = findChildFiberAt(parent, index - 1);

  // If the fiber is not found add the fiber at the bottom.
  if (previousSibling === null) {
    return prependChildFiber(parent, child);
  }

  // Add the fiber as sibling of the previous one.
  return addSiblingFiber(previousSibling, child);
}

/**
 * Add a child fiber in a parent fiber before the child fiber with the given
 * key and return the index in which it is added.
 * If the key is not found the fiber is added at the bottom.
 *
 * @param parent  - The parent fiber in which to add the child fiber.
 * @param child   - The child fiber to add.
 * @param key     - The key of the previous child fiber.
 * @returns       - The index in which the child fiber is added.
 */
export function addChildFiberBefore(
  parent: Fiber,
  child: Fiber,
  key: string
): number {
  // Find the previous fiber.
  const previousFiber = findPreviousFiber(parent, key);

  // If the previous child fiber is not found add the child fiber at the bottom.
  if (previousFiber === null) {
    return appendChildFiber(parent, child);
  }

  // If the fiber with the given key is the first one.
  if (previousFiber === parent) {
    return prependChildFiber(parent, child);
  }

  // Add the fiber as sibling of the previous one.
  return addSiblingFiber(previousFiber, child);
}

/**
 * Add a child fiber at the bottom and return the index in which it is added.
 *
 * @param parent  - The parent fiber in which to add the child fiber.
 * @param child   - The child fiber to add.
 * @returns       - The index in which the fiber is added.
 */
export function appendChildFiber(parent: Fiber, child: Fiber): number {
  const previousFiber = findChildFiberAt(parent, -1);

  // If the parent fiber has no children.
  if (previousFiber === null) {
    return prependChildFiber(parent, child);
  }

  return addSiblingFiber(previousFiber, child);
}

/**
 * Add a sibling fiber after a fiber and return the index in which it is added.
 *
 * @param fiber   - The fiber.
 * @param sibling - The sibling fiber to add.
 * @returns       - The index in which the sibling fiber is added.
 */
export function addSiblingFiber(fiber: Fiber, sibling: Fiber): number {
  const oldSibling = fiber.sibling;
  const index = fiber.index + 1;

  // Update the sibling fiber fields.
  fiber.sibling = sibling;
  sibling.return = fiber.return;
  sibling.sibling = oldSibling;

  return index;
}

/**
 * Add a child fiber at the beginning child and retun 0.
 *
 * @param parent  - The parent fiber.
 * @param child   - The child fiber.
 * @returns       - The index in which the fiber is added.
 */
export function prependChildFiber(parent: Fiber, child: Fiber): number {
  const oldFirstChild = parent.child;

  // Update the child fiber fields.
  parent.child = child;
  child.sibling = oldFirstChild;
  child.return = parent;

  return 0;
}
