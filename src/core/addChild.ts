import type {Fiber} from 'react-reconciler';
import {addChildFiberBefore, addChildFiberAt} from '../fiber/addFiber';
import {
  updateFibersIndices,
  updateFiberDebugFields,
} from '../fiber/updateFiber';
import {warning} from '../warning';
import {findPreviousFiber} from '../fiber/findFIber';

/**
 * Add a child fiber in a parent fiber and return the index in which it is added.
 * The position can be chosen by providing a key (string) or by providing an index (number).
 * If a key (string) is provided the child will be added after the one with that key.
 * The child is added at the bottom if none of the children have that key.
 * If an index (number) is provided the child will be added in that position.
 * The child is added at the bottom if -1 is provided or the index is greater
 * than the number of children.
 *
 * @param parent    - The parent fiber in which to add the child fiber.
 * @param child     - The child fiber to add.
 * @param position  - The position in which to add the child fiber.
 * @returns         - The index in which the child fiber is added.
 */
export function addChild(
  parent: Fiber,
  child: Fiber,
  position: string | number
): number {
  // The index in which the child is added.
  let index: number;

  // Add the child.
  if (typeof position === 'number') {
    index = addChildFiberAt(parent, child, position);
  } else {
    index = addChildFiberBefore(parent, child, position);
  }

  if (__DEV__) {
    if (typeof position === 'number') {
      // If the child is added in a different position.
      if (position !== -1 && index !== position) {
        warning(
          `The index provided is greater than the number of children, ` +
            `the child is added at the bottom.`
        );
      }
    } else {
      // If no children have the provided key.
      if (findPreviousFiber(parent, position) === null) {
        warning(
          `No child with the key: '${position}' has been found,` +
            `the child is added at the bottom.`
        );
      }
    }
  }

  // Update the child fields.
  updateFibersIndices(child, index);
  if (__DEV__) {
    updateFiberDebugFields(child, parent);
  }

  // If There is no alternate we can return here.
  if (child.alternate === null || parent.alternate === null) {
    if (child.alternate !== null) {
      // The React team has done such a good job with the reconciler that we can simply
      // leave the alternate attached (although the parent does not yet exist)
      // and the reconciler will update it during the next render.
      // Removing it would take a lot of work (sync all the subtree and update the stateNodes references).
      child.alternate.return = null;
      child.alternate.sibling = null;
    }

    return index;
  }

  // Add the alternate child.
  if (typeof position === 'number') {
    addChildFiberAt(parent.alternate, child.alternate, position);
  } else {
    addChildFiberBefore(parent.alternate, child.alternate, position);
  }

  // Update the alternate child fields.
  updateFibersIndices(child.alternate, index);
  if (__DEV__) {
    updateFiberDebugFields(child.alternate, parent);
  }

  return index;
}
