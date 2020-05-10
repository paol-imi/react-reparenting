import type {Fiber} from 'react-reconciler';

/**
 * Return the child fiber at the given index or null if the parent has no children.
 * If the index provided is greater than the number of children the last child is returned.
 *
 * @param parent  - The parent fiber.
 * @param index   - The index of the child fiber to find.
 * @returns       - The child fiber found or null.
 */
export function findChildFiberAt(parent: Fiber, index: number): Fiber | null {
  // The first child.
  let {child} = parent;

  // If the parent has no children.
  if (child === null) {
    return null;
  }

  if (index === -1) {
    // Find the last child.
    while (child.sibling) {
      child = child.sibling;
    }
  } else {
    // Find the child at the given index.
    while (child.sibling && index > 0) {
      index -= 1;
      child = child.sibling;
    }
  }

  return child;
}

/**
 * Return the child fiber with the given key or null if it is not found.
 *
 * @param parent  - The parent fiber.
 * @param key     - The key of the child fiber to find.
 * @returns       - The child fiber found or null.
 */
export function findChildFiber(parent: Fiber, key: string): Fiber | null {
  // The first child.
  const {child} = parent;

  // If the parent has no children.
  if (child === null) {
    return null;
  }

  // If the fiber to find is the first one.
  if (child.key === key) {
    return child;
  }

  // Find the fiber in the siblings.
  return findSiblingFiber(child, key);
}

/**
 * Return the fiber before the one with the given key or null if it is not found.
 * If the fiber with the given key is the first child of the parent, the parent is returned.
 *
 * @param parent  - The parent fiber.
 * @param key     - The key of the child fiber.
 * @returns       - The fiber found or null.
 */
export function findPreviousFiber(parent: Fiber, key: string): Fiber | null {
  let {child} = parent;

  // If the parent has no child.
  if (child === null) {
    return null;
  }

  // If the fiber to find is the first one.
  if (child.key === key) {
    return parent;
  }

  let {sibling} = child;

  // Find the previous sibling.
  while (sibling) {
    // If the fiber is found.
    if (sibling.key === key) {
      return child;
    }

    child = sibling;
    sibling = child.sibling;
  }

  return null;
}

/**
 * Return the child fiber with the given key or null if it is not found.
 *
 * @param parent  - The parent fiber.
 * @param key     - The key of the child fiber to find.
 * @returns       - The fiber found or null.
 */
export function findSiblingFiber(fiber: Fiber, key: string): Fiber | null {
  let {sibling} = fiber;

  // Find the child with the given key.
  while (sibling && sibling.key !== key) {
    sibling = sibling.sibling;
  }

  return sibling;
}
