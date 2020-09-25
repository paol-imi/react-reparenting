import type {Fiber} from 'react-reconciler';
import {Env} from '../env/env';
import {addChildFiberAt, addChildFiberBefore} from '../fiber/addFiber';
import {updateFibersIndex} from '../fiber/updateFiber';
import {findPreviousFiber} from '../fiber/findFiber';
import {getFiberFromPath} from '../fiber/getFiber';
import {invariant} from '../invariant';
import {warning} from '../warning';

/**
 * Add a child in a parent and return the index in which it is added.
 * The position of the child can be chosen by providing a key (string) or an index (number).
 * If a key (string) is provided the child will be added after the one with that key.
 * The child is added at the bottom if none of the children have that key.
 * If an index (number) is provided the child will be added in that position.
 * The child is added at the bottom if -1 is provided or the index is greater
 * than the number of children.
 * The method will also try to add the elements connected to the child (e.g. DOM elements),
 * it is possible to disable this function using the skipUpdate parameter.
 *
 * @param parent      - The parent in which to add the child.
 * @param child       - The child to add.
 * @param position    - The position in which to add the child.
 * @param skipUpdate  - Whether to add or not the elements.
 * @returns           - The index in which the child is added.
 */
export function addChild(
  parent: Fiber,
  child: Fiber,
  position: string | number,
  skipUpdate?: boolean
): number {
  invariant(
    typeof position !== 'number' || position >= -1,
    `The index provided to add the child must be ` +
      `greater than or equal to -1, found: ${position}.`
  );

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
          `No child with the key: '${position}' has been found, ` +
            `the child is added at the bottom.`
        );
      }
    }
  }

  // Update the child fields.
  updateFibersIndex(child, index);

  // If there are the alternates.
  if (child.alternate === null || parent.alternate === null) {
    if (child.alternate !== null) {
      // The React team has done such a good job with the reconciler that we can simply
      // leave the alternate attached (although the parent does not yet exist)
      // and the reconciler will update it during the next render.
      // Removing it would take a lot of work (sync all the subtree and update the stateNodes references).
      child.alternate.return = null;
      child.alternate.sibling = null;
    }
  } else {
    // Add the alternate child.
    if (typeof position === 'number') {
      addChildFiberAt(parent.alternate, child.alternate, position);
    } else {
      addChildFiberBefore(parent.alternate, child.alternate, position);
    }

    // Update the alternate child fields.
    updateFibersIndex(child.alternate, index);
  }

  // If we don't have to send the elements we can return here.
  if (skipUpdate) {
    return index;
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

    return index;
  }

  // Child element not found.
  if (elementFiber === null) {
    if (__DEV__) {
      warning(
        'Cannot find the child element. ' +
          'You should manually send the element and use the `skipUpdate` option.'
      );
    }

    return index;
  }

  // Get the elements instances.
  const container = containerFiber.stateNode;
  const element = elementFiber.stateNode;

  // Add the child element.
  if (child.sibling === null) {
    // Append the child to the container.
    Env.appendChildToContainer(container, element);
  } else {
    // Get the fibers that belong to the previous element.
    const beforeFiber = getFiberFromPath(
      child.sibling,
      (fiber) => fiber.child,
      (fiber) => Env.isElement(fiber.elementType, fiber.stateNode)
    );

    if (beforeFiber !== null) {
      const before = beforeFiber.stateNode;
      // Insert the child element in the container.
      Env.insertInContainerBefore(container, element, before);
    }

    // Previous element not found.
    if (__DEV__) {
      if (beforeFiber === null) {
        warning(
          'Cannot find the previous element. ' +
            'You should manually send the element and use the `skipUpdate` option.'
        );
      }
    }
  }

  return index;
}
