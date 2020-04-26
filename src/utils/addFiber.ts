import type {Fiber} from 'react-reconciler'; // eslint-disable-line
import {findChildFiberAt, findPreviousFiber} from './findFiber';
import {updateFiberDebugOwner, updateFibersIndices} from './updateFiber';
import {warning} from '../warning';

/**
 * Add a child fiber in the parent at the given index.
 * If index is -1 the fiber is added at the bottom.
 * If the index provided is greater than the number of children available
 * the fiber is added at the bottom.
 *
 * @param parent - The parent fiber.
 * @param child - The child fiber.
 * @param index - The index in which to add the fiber.
 * @param skipUpdate - Whether to skip updating computed properties.
 * @returns - The index in which the fiber is added.
 */
export function addChildFiberAt(
  parent: Fiber,
  child: Fiber,
  index: number,
  skipUpdate?: boolean
): number {
  // If the fiber is not found add the fiber at the bottom.
  if (index === -1) return appendChildFiber(parent, child, skipUpdate);
  // Add the fiber in the first index.
  if (index === 0) return prependChildFiber(parent, child, skipUpdate);

  // Find the previous sibling.
  // At this point we are sure that the index is greater than 0.
  const previousFiber = findChildFiberAt(parent, index - 1);

  // Warning if the fiber is not found.
  // The warnings are removed in production.
  warning(
    previousFiber !== null,
    `The fiber cannot be added at index: '${index}', it is added at the bottom`
  );

  // If the fiber is not found add the fiber at the bottom.
  if (previousFiber === null) {
    return appendChildFiber(parent, child, skipUpdate);
  }

  // Add the fiber as sibling of the previous one.
  return addSiblingFiber(previousFiber, child, skipUpdate);
}

/**
 * Add the child fiber in the parent before the fiber with the given key.
 * If the key is not found the fiber is added at the bottom.
 *
 * @param parent - The parent fiber.
 * @param child - The child fiber.
 * @param key - The key of the previous fiber.
 * @param skipUpdate - Whether to skip updating computed properties.
 * @returns - The index in which the fiber is added.
 */
export function addChildFiberBefore(
  parent: Fiber,
  child: Fiber,
  key: string,
  skipUpdate?: boolean
): number {
  // Find the previous fiber.
  const previousFiber = findPreviousFiber(parent, key);

  // Warning if the fiber was not found.
  // The warnings are removed in production.
  warning(
    previousFiber !== null,
    `No fiber with the key: '${key}' has been found, the fiber is added at the bottom`
  );

  // If the fiber is not found add the fiber at the bottom.
  if (previousFiber === null) {
    return appendChildFiber(parent, child, skipUpdate);
  }

  // If The fiber with the given key is the first one.
  if (previousFiber === parent) {
    return prependChildFiber(parent, child, skipUpdate);
  }

  // Add the fiber as sibling of the previous one.
  return addSiblingFiber(previousFiber, child, skipUpdate);
}

/**
 * Add the fiber at the bottom.
 *
 * @param parent - The parent fiber.
 * @param child - The child fiber.
 * @param skipUpdate - Whether to skip updating computed properties.
 * @returns - The index in which the fiber is added.
 */
export function appendChildFiber(
  parent: Fiber,
  child: Fiber,
  skipUpdate?: boolean
): number {
  const previousFiber = findChildFiberAt(parent, -1);

  // The parent has no children.
  if (previousFiber === null) {
    return prependChildFiber(parent, child, skipUpdate);
  }

  return addSiblingFiber(previousFiber, child, skipUpdate);
}

/**
 * Add the fiber after the given sibling fiber.
 *
 * @param fiber - The fiber.
 * @param sibling - The fiber to add as sibling.
 * @param skipUpdate - Whether to skip updating computed properties.
 * @returns - The index in which the fiber is added.
 */
export function addSiblingFiber(
  fiber: Fiber,
  sibling: Fiber,
  skipUpdate?: boolean
): number {
  const oldSibling = fiber.sibling;
  const index = fiber.index + 1;

  // Update fiber references.
  fiber.sibling = sibling;
  sibling.sibling = oldSibling;
  sibling.return = fiber.return;

  // Update computed fiber properties.
  if (!skipUpdate) {
    updateFibersIndices(sibling, index);
    // Removed in production.
    updateFiberDebugOwner(sibling, fiber.return);
  }

  return index;
}

/**
 * Add the fiber as first child.
 *
 * @param parent - The parent fiber.
 * @param child - The child fiber.
 * @returns - The index in which the fiber is added.
 */
export function prependChildFiber(
  parent: Fiber,
  child: Fiber,
  skipUpdate?: boolean
): number {
  const oldFirstChild = parent.child;

  // Update fiber references.
  parent.child = child;
  child.sibling = oldFirstChild;
  child.return = parent;

  // Update computed fiber properties.
  if (!skipUpdate) {
    updateFibersIndices(child, 0);
    // Removed in production.
    updateFiberDebugOwner(child, parent);
  }

  return 0;
}
