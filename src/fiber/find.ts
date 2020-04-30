import type {Fiber} from 'react-reconciler';
import type {HostENV} from '../core/ENV';
import {warning} from '../warning';
import {invariant} from '../invariant';

/**
 * Returns the child fiber in the given index or if the paremt has no children.
 * If the index provided is greater than the number of children the last child is returned.
 *
 * @param parent - The parent fiber.
 * @param index - The index of the child fiber to find.
 * @returns - The fiber found or null.
 */
export function findChildFiberAt(parent: Fiber, index: number): Fiber | null {
  invariant(
    index >= -1,
    `The index of the fiber to find must be >= -1, found: ${index}`
  );

  // The first child.
  let {child} = parent;

  if (__DEV__) {
    if (index !== -1 && child === null) {
      warning('The parent fiber has no children');
    }
  }

  // If the parent has no children.
  if (child === null) {
    return null;
  }

  if (index === -1) {
    let {sibling} = child;
    // Find the last child.
    while (sibling) {
      child = sibling;
      sibling = child.sibling;
    }
  } else {
    let {sibling} = child;
    // Find the child at the given index.
    while (sibling && index > 0) {
      index -= 1;
      child = sibling;
      sibling = child.sibling;
    }
  }

  if (__DEV__) {
    if (index > 0) {
      warning(
        'The index provided is greater than the number of children, the last child is returned'
      );
    }
  }

  return child;
}

/**
 * Returns the child fiber with the given key or null if it is not found.
 *
 * @param parent - The parent fiber.
 * @param key - The key of the child fiber to find.
 * @returns - The fiber found or null.
 */
export function findChildFiber(parent: Fiber, key: string): Fiber | null {
  let {child} = parent;

  if (__DEV__) {
    if (child === null) {
      warning('The parent fiber has no children');
    }
  }

  // Find the child with the given key.
  while (child && child.key !== key) {
    child = child.sibling;
  }

  if (__DEV__) {
    if (child === null) {
      warning(`No child with the key: '${key}' has been found`);
    }
  }

  return child;
}

/**
 * Returns the fiber before the one with the given key or null if it is not found.
 * If the fiber with the given key is the first child of the parent, the parent is returned.
 *
 * @param parent - The parent fiber.
 * @param key - The key of the child fiber.
 * @returns - The fiber found or null.
 */
export function findPreviousFiber(parent: Fiber, key: string): Fiber | null {
  let {child} = parent;

  // If the parent has no child.
  if (child === null) {
    if (__DEV__) {
      warning('The parent fiber has no children');
    }

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

  if (__DEV__) {
    warning(`No child found with the key: '${key}'`);
  }

  return null;
}

/**
 * Returns the first instance found in the parent fibers.
 *
 * @param fiber - The fiber.
 * @returns - The container instance or null.
 */
export function findContainerInstanceFiber<T>(
  fiber: Fiber | null,
  isElement: HostENV<T>['isElement']
): InstanceFiber<T> | null {
  while (fiber) {
    if (isElement(fiber.elementType, fiber.stateNode)) {
      return fiber;
    }

    // Search in the next parent.
    fiber = fiber.return;
  }

  if (__DEV__) {
    warning('Cannot find the container instance');
  }

  return null;
}

/**
 * Returns the first instance found in the parent fibers.
 *
 * @param fiber - The fiber.
 * @returns - The instance or null.
 */
export function findInstanceFiber<T>(
  fiber: Fiber | null,
  isElement: HostENV<T>['isElement']
): InstanceFiber<T> | null {
  while (fiber) {
    // If this fiber contains the instance.
    if (isElement(fiber.elementType, fiber.stateNode)) {
      return fiber;
    }

    if (__DEV__) {
      if (fiber.sibling !== null)
        warning(
          'The structure of the child component does not allow to determine the instance with certainty, The descendants before the instance should be only children'
        );
    }

    // Search in the next descendant.
    fiber = fiber.child;
  }

  if (__DEV__) {
    warning('Cannot find the instance');
  }

  return null;
}

/** Fiber of an Instance. */
export interface InstanceFiber<T> extends Fiber {
  stateNode: T;
}
