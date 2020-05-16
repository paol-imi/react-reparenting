import type {Fiber} from 'react-reconciler';
import {removeChildFiber, removeChildFiberAt} from '../fiber/removeFiber';
import {updateFibersIndices} from '../fiber/updateFiber';
import {invariant} from '../invariant';
import {warning} from '../warning';

/**
 * Remove a child fiber from its parent fiber and return it.
 * The child to remove can be chosen by providing its key (string) or by
 * providing its index (number).
 * If the child is not found null is returned.
 *
 * @param parent        - The parent fiber from which to remove the child fiber.
 * @param childSelector - The child fiber selector.
 * @returns             - The removed child fiber or null.
 */
export function removeChild(
  parent: Fiber,
  childSelector: string | number
): Fiber | null {
  // The removed fiber.
  let fiber = null;

  // Remove the fiber.
  if (typeof childSelector === 'number') {
    fiber = removeChildFiberAt(parent, childSelector);
  } else {
    fiber = removeChildFiber(parent, childSelector);
  }

  // If the fiber is not found return null.
  if (fiber === null) {
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
  if (fiber.sibling !== null) {
    updateFibersIndices(fiber.sibling, fiber.index);
  }

  // If There is no alternate we can return here.
  if (fiber.alternate === null || parent.alternate === null) {
    return fiber;
  }

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
    'The alternate child has not been removed.' +
      'This is a bug in React-reparenting, please file an issue.'
  );

  // If there are siblings their indices need to be updated.
  if (alternate.sibling !== null) {
    updateFibersIndices(alternate.sibling, alternate.index);
  }

  return fiber;
}
