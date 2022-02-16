import type {Fiber} from 'react-reconciler';
import {Env} from '../env/env';
import {addChildFiberAt, addChildFiberBefore} from '../fiber/addFiber';
import {findPreviousFiber} from '../fiber/findFiber';
import {getCurrentFiber, getFiberFromPath} from '../fiber/getFiber';
import {removeChildFiber, removeChildFiberAt} from '../fiber/removeFiber';
import {updateFiberDebugFields, updateFibersIndex} from '../fiber/updateFiber';
import {invariant} from '../invariant';
import {warning} from '../warning';

/**
 * The ParentFiber implement the logic to manage a fiber of a parent component.
 * It provides simple methods for managing reparenting, such as add(), remove() and send().
 */
export class ParentFiber {
  /** The parent fiber. */
  fiber: Fiber | null = null;

  /**
   * Parent fiber setter.
   *
   * @param fiber - The parent fiber to manage.
   */
  setFiber(fiber: Fiber): void {
    this.fiber = fiber;
  }

  /**
   * Parent fiber getter.
   * This is necessary to always get the
   * reference of the current fiber.
   *
   * @returns - The current parent fiber.
   */
  getCurrent(): Fiber {
    invariant(
      this.fiber !== null,
      'Cannot call ParentFiber methods before it is initialized.'
    );

    // Find the current fiber.
    return getCurrentFiber(this.fiber);
  }

  /**
   * Add a child fiber in this instance and return the index in which it is added.
   * The position can be chosen by providing a key (string) or by providing an index (number).
   * If a key (string) is provided the child will be added after the one with that key.
   * The child is added at the bottom if none of the children have that key.
   * If an index (number) is provided the child will be added in that position.
   * The child is added at the bottom if -1 is provided or the index is greater
   * than the number of children.
   * The method will also try to add the elements connected to the fibers (e.g. DOM elements),
   * to disable this function you can use the skipUpdate parameter.
   *
   * @param child       - The child fiber to add.
   * @param position    - The position in which to add the child fiber.
   * @param skipUpdate  - Whether to add or not the elements.
   * @returns           - The index in which the child fiber is added.
   */
  addChild(
    child: Fiber,
    position: string | number,
    skipUpdate?: boolean
  ): number {
    invariant(
      typeof position !== 'number' || position >= -1,
      `The index provided to add the child must be ` +
        `greater than or equal to -1, found: ${position}.`
    );

    const parent = this.getCurrent();
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
    if (__DEV__) {
      updateFiberDebugFields(child, parent);
    }

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
      if (__DEV__) {
        updateFiberDebugFields(child.alternate, parent);
      }
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

  /**
   * Remove a child fiber from this instance and return it.
   * The child to remove can be chosen by providing its key (string) or by
   * providing its index (number).
   * The method will also try to remove the elements connected to the fibers (e.g. DOM elements),
   * to disable this function you can use the skipUpdate parameter.
   * If the child is not found null is returned.
   *
   * @param childSelector - The child fiber selector.
   * @param skipUpdate    - Whether to remove or not the elements.
   * @returns             - The removed child fiber or null.
   */
  removeChild(
    childSelector: string | number,
    skipUpdate?: boolean
  ): Fiber | null {
    invariant(
      typeof childSelector !== 'number' || childSelector >= 0,
      `The index provided to remove the child must be ` +
        `greater than or equal to 0, found: ${childSelector}.`
    );

    const parent = this.getCurrent();
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
          warning(
            `Cannot find and remove the child at index: ${childSelector}.`
          );
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

  /**
   * Remove a child fiber from this instance and add it to another ParentFiber instance.
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
   * @param toParent      - The ParentFiber instance in which to send the child fiber.
   * @param childSelector - The child fiber selector.
   * @param position      - The position in which to add the child fiber.
   * @param skipUpdate    - Whether to send or not the elements.
   * @returns             - The position in which the child fiber is sent or -1.
   */
  sendChild(
    toParent: ParentFiber,
    childSelector: string | number,
    position: string | number,
    skipUpdate?: boolean
  ): number {
    // Remove the child fiber.
    const child = this.removeChild(childSelector, skipUpdate);
    // Return -1 if the child fiber does not exist.
    if (child === null) {
      return -1;
    }
    // Add the child fiber.
    return toParent.addChild(child, position, skipUpdate);
  }

  /**
   * Clear the parent fiber.
   */
  clear(): void {
    this.fiber = null;
  }
}
