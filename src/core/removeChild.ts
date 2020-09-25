import type {Fiber} from 'react-reconciler';
import {Env} from '../env/env';
import {removeChildFiber, removeChildFiberAt} from '../fiber/removeFiber';
import {updateFibersIndex} from '../fiber/updateFiber';
import {getFiberFromPath} from '../fiber/getFiber';
import {invariant} from '../invariant';
import {warning} from '../warning';

/**
 * Remove a child from its parent and return it.
 * The child to remove can be chosen by providing its key (string) or its index (number).
 * The method will also try to remove the elements connected to the child (e.g. DOM elements),
 * it is possible to disable this function using the skipUpdate parameter.
 * If the child is not found null is returned.
 *
 * @param parent        - The parent from which to remove the child.
 * @param childSelector - The child selector.
 * @param skipUpdate    - Whether to add or not the elements.
 * @returns             - The removed child or null.
 */
export function removeChild(
  parent: Fiber,
  childSelector: string | number,
  skipUpdate?: boolean
): Fiber | null {
  invariant(
    typeof childSelector !== 'number' || childSelector >= 0,
    `The index provided to remove the child must be ` +
      `greater than or equal to 0, found: ${childSelector}.`
  );

  // The removed child.
  let child = null;

  // Remove the child.
  if (typeof childSelector === 'number') {
    child = removeChildFiberAt(parent, childSelector);
  } else {
    child = removeChildFiber(parent, childSelector);
  }

  // If the child is not found return null.
  if (child === null) {
    if (__DEV__) {
      if (typeof childSelector === 'number') {
        // Invalid index.
        warning(`Cannot find and remove the child at index: ${childSelector}.`);
      } else {
        // Invalid key.
        warning(
          `No child with the key: '${childSelector}' has been found, ` +
            `the child cannot be removed.`
        );
      }
    }

    return null;
  }

  // If there are siblings their indices need to be updated.
  if (child.sibling !== null) {
    updateFibersIndex(child.sibling, child.index);
  }

  // If There is no alternate we can return here.
  if (child.alternate !== null && parent.alternate !== null) {
    // The alternate child.
    let alternate = null;

    // Remove the alternate child.
    if (typeof childSelector === 'number') {
      alternate = removeChildFiberAt(parent.alternate, childSelector);
    } else {
      alternate = removeChildFiber(parent.alternate, childSelector);
    }

    // We should find it because we are shure it exists.
    invariant(
      alternate !== null,
      'The alternate child has not been removed. ' +
        'This is a bug in React-reparenting, please file an issue.'
    );

    // If there are siblings their indices need to be updated.
    if (alternate.sibling !== null) {
      updateFibersIndex(alternate.sibling, alternate.index);
    }
  }

  // If we don't have to send the elements we can return here.
  if (skipUpdate) {
    return child;
  }

  // Get the fibers that belong to the container elements.
  const containerFiber = getFiberFromPath(
    parent,
    (fiber) => fiber.return,
    (fiber) => Env.isElement(fiber.elementType, fiber.stateNode)
  );

  // Get the fibers that belong to the child element.
  const elementFiber = getFiberFromPath(
    child,
    (fiber) => fiber.child,
    (fiber) => Env.isElement(fiber.elementType, fiber.stateNode)
  );

  // Container element not found.
  if (containerFiber === null) {
    if (__DEV__) {
      warning(
        'Cannot find the container element, neither the parent nor any ' +
          'component before it seems to generate an element instance. ' +
          'You should manually send the element and use the `skipUpdate` option.'
      );
    }

    return child;
  }

  // Child element not found.
  if (elementFiber === null) {
    if (__DEV__) {
      warning(
        'Cannot find the child element. ' +
          'You should manually send the element and use the `skipUpdate` option.'
      );
    }

    return child;
  }

  // Get the elements instances.
  const container = containerFiber.stateNode;
  const element = elementFiber.stateNode;

  // Remove the element instance.
  Env.removeChildFromContainer(container, element);

  return child;
}
