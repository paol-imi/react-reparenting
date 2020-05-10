import type {Fiber} from 'react-reconciler';
import {addChild} from './addChild';
import {removeChild} from './removeChild';
import {Env} from '../env/env';
import {searchFiber} from '../fiber/search';
import {warning} from '../warning';

/**
 * Remove a child fiber from a parent fiber and add it to another parent fiber.
 * Return the index in which the child is added or -1 if the child is not found.
 * The child to remove can be chosen by providing its key (string) or by providing its index (number).
 * The position can be chosen by providing a key (string) or by providing an index (number).
 * If a key (string) is provided the child will be added after the one with that key.
 * The child is added at the bottom if none of the children have that key.
 * If an index (number) is provided the child will be added in that position.
 * The child is added at the bottom if -1 is provided or the index is greater than the number of children.
 * The method will also try to send the elements connected to the fibers (e.g. DOM elements),
 * to disable this function you can use the skipUpdate parameter.
 *
 * @param fromParent    - The parent fiber from which to remove the child fiber.
 * @param toParent      - The parent fiber in which to add the child fiber.
 * @param childSelector - The child fiber selector.
 * @param position      - The position in which to add the child fiber.
 * @param skipUpdate    - Whether to send or not the elements.
 * @returns             - The position in which the child fiber is sent or -1.
 */
export function sendChild(
  fromParent: Fiber,
  toParent: Fiber,
  childSelector: string | number,
  position: string | number,
  skipUpdate?: boolean
): number {
  // Remove the child fiber.
  const child = removeChild(fromParent, childSelector);
  // Return -1 if the child fiber does not exist.
  if (child === null) {
    return -1;
  }
  // Add the child fiber.
  const index = addChild(toParent, child, position);

  // If we don't have to send the elements we can return here.
  if (skipUpdate) {
    return index;
  }

  // Get the fibers that belong to the container elements.
  const fromContainer = searchFiber(
    fromParent,
    (fiber) => fiber.return,
    (fiber) => Env.isElement(fiber.elementType, fiber.stateNode)
  );
  const toContainer = searchFiber(
    toParent,
    (fiber) => fiber.return,
    (fiber) => Env.isElement(fiber.elementType, fiber.stateNode)
  );

  // Containers elements not found.
  if (fromContainer === null || toContainer === null) {
    if (__DEV__) {
      warning(
        'Cannot find the container element, neither the parent nor any' +
          'component before it seems to generate an element instance.' +
          'You should manually send the element and use the `skipUpdate` option.'
      );
    }

    return index;
  }

  // Get the fibers that belong to the child element.
  const element = searchFiber(
    child,
    (fiber) => fiber.child,
    (fiber) => Env.isElement(fiber.elementType, fiber.stateNode)
  );

  // Child element not found.
  if (element === null) {
    if (__DEV__) {
      warning(
        'Cannot find the child element.' +
          'You should manually send the element and use the `skipUpdate` option.'
      );
    }

    return index;
  }

  // Add the child element.
  if (child.sibling === null) {
    // Remove the element instance.
    Env.removeChildFromContainer(fromContainer.stateNode, element.stateNode);
    // Append the child to the container.
    Env.appendChildToContainer(toContainer.stateNode, element.stateNode);
  } else {
    // Get the fibers that belong to the previous element.
    const before = searchFiber(
      child.sibling,
      (fiber) => fiber.child,
      (fiber) => Env.isElement(fiber.elementType, fiber.stateNode)
    );

    if (before !== null) {
      // Remove the element instance.
      Env.removeChildFromContainer(fromContainer.stateNode, element.stateNode);
      // Insert the child element in the container.
      Env.insertInContainerBefore(
        toContainer.stateNode,
        element.stateNode,
        before.stateNode
      );
    }

    // Previous elements not found.
    if (__DEV__) {
      if (before === null) {
        warning(
          'Cannot find the previous element.' +
            'You should manually send the element and use the `skipUpdate` option.'
        );
      }
    }
  }

  return index;
}
