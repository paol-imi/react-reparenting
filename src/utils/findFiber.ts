import type {Fiber} from 'react-reconciler'; // eslint-disable-line
import type {HostENV} from '../core/hostENV';
import {warning} from '../warning';

/**
 * Returns the child fiber in the given index.
 * If the paremt has no children, or the index provided is
 * greater than the number of children null is returned.
 *
 * @param parent - The parent fiber.
 * @param index - The index of the fiber to find.
 * @returns - The fiber found or null.
 */
export function findChildFiberAt(parent: Fiber, index: number): Fiber | null {
  // The warnings are removed in production.
  warning(
    index >= -1,
    'The index of the fiber to find must be >= -1, the last child is returned'
  );

  // The first child.
  let {child} = parent;

  // The warnings are removed in production.
  warning(index === -1 || child !== null, 'The parent fiber has no children');

  // If the parent has no child return null.
  if (child === null) return null;

  if (index === -1) {
    // Find the last child.
    while (child.sibling) child = child.sibling;
  } else {
    // Find the child in index.
    while (child && index-- > 0) child = child.sibling;
  }

  // The warnings are removed in production.
  warning(
    child !== null,
    'The index provided is greater than the number of children, null is returned'
  );

  return child;
}

/**
 * Returns the child fiber with the given key or null if it is not found.
 *
 * @param parent - The parent fiber.
 * @param key - The key of the child fiber.
 * @returns - The fiber found or null.
 */
export function findChildFiber(parent: Fiber, key: string): Fiber | null {
  let {child} = parent;

  // The warnings are removed in production.
  warning(child !== null, 'The parent fiber has no children');

  // Find the child with the given key.
  while (child && child.key !== key) {
    child = child.sibling;
  }

  // The warnings are removed in production.
  warning(child !== null, `No child found with the key: '${key}'`);

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
  let sibling;

  // The warnings are removed in production.
  warning(child !== null, 'The parent fiber has no children');

  // If the parent has no child return null.
  if (child === null) return null;

  // Return the parent if the fiber to find is the first one.
  if (child.key === key) return parent;

  // Find the previous sibling.
  while (child) {
    sibling = child.sibling;
    if (sibling && sibling.key === key) return child;
    child = sibling;
  }

  // The warnings are removed in production.
  warning(child !== null, `No child found with the key: '${key}'`);

  return child;
}

/**
 * Return the first instance found in the parent fibers.
 *
 * @param fiber - The fiber.
 * @returns - The instance or null.
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

  warning(true, 'Cannot find the container instance');

  return null;
}

/**
 * Return the first instance found in the parent fibers.
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

    // Search in the next descendant.
    fiber = fiber.child;

    // The descendants before the instance must be single children.
    warning(
      fiber === null || fiber.sibling === null,
      'The structure of the child component does not allow to determine the child instance with certainty'
    );
  }

  warning(true, 'Cannot find the instance');

  return null;
}

/** Fiber of an Instance. */
export interface InstanceFiber<T> extends Fiber {
  stateNode: T;
}
