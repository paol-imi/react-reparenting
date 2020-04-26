import type {Fiber} from 'react-reconciler'; // eslint-disable-line
import {ENV} from './hostENV';
import {addChildFiberAt, addChildFiberBefore} from '../utils/addFiber';
import {removeChildFiber, removeChildFiberAt} from '../utils/removeFiber';
import {getCurrentFiber} from '../utils/getFiber';
import {
  findContainerInstanceFiber,
  findInstanceFiber,
} from '../utils/findFiber';
import {invariant} from '../invariant';
import {warning} from '../warning';

/**
 * The ParentFiber implement the logic manage a fiber of a parent component.
 * It provides simple methods for managing reparenting, such as add(), remove() and sending().
 */
export class ParentFiber {
  /** The parent fiber. */
  fiber: Fiber | null = null;

  /**
   * The fiber can be setted in the constructor.
   *
   * @param fiber - The parent fiber to manage.
   */
  constructor(fiber?: Fiber) {
    if (fiber) this.setFiber(fiber);
  }

  /**
   * Parent fiber setter.
   *
   * @param fiber - The parent fiber to manage.
   */
  setFiber(fiber: Fiber): void {
    // Warnings are removed in production.
    warning(fiber !== null, 'The fiber you have provided is null');
    this.fiber = fiber;
  }

  /**
   * Parent fiber getter.
   * This is necessary to always get the
   * reference of the current fiber.
   *
   * @returns - The current parent fiber.
   */
  getFiber(): Fiber {
    invariant(
      this.fiber !== null,
      'Cannot call Parent methods before it is initialized'
    );
    return getCurrentFiber(this.fiber);
  }

  /**
   * Add a child fiber in the parent and return the index in which it is added.
   * The position can be chosen by providing a key (string) or by providing an index (number).
   * If a key (string) is provided the child will be added after the one with that key.
   * - The child is added at the bottom if none of the children have that key.
   * If an index (number) is provided the child will be added in that position.
   * - The child is added at the bottom if -1 is provided or the index is greater than the number of children.
   *
   * @param child - The child to add.
   * @param position - The position in which to add the child.
   * @returns - The index in which the child is added.
   */
  add(child: Fiber, position: string | number): number {
    const parentFiber = this.getFiber();
    let index;

    // Add the fiber.
    if (typeof position === 'number') {
      index = addChildFiberAt(parentFiber, child, position);
    } else {
      index = addChildFiberBefore(parentFiber, child, position);
    }

    // If There is no alternate we can return here.
    if (child.alternate === null || parentFiber.alternate === null) {
      child.alternate = null;
      return index;
    }

    // Add the alternate
    if (typeof position === 'number') {
      addChildFiberAt(parentFiber.alternate, child.alternate, position);
    } else {
      addChildFiberBefore(parentFiber.alternate, child.alternate, position);
    }

    return index;
  }

  /**
   * Remove a child from the parent and return it.
   * The child to remove can be chosen by providing its key (string)
   * or by providing its index (number).
   * If the child is not found null is returned.
   *
   * @param child - The child identifier.
   * @returns - The removed child or null.
   */
  remove(child: string | number): Fiber | null {
    const parentFiber = this.getFiber();
    let fiber = null;

    // Remove the fiber.
    if (typeof child === 'number') {
      fiber = removeChildFiberAt(parentFiber, child);
    } else {
      fiber = removeChildFiber(parentFiber, child);
    }

    // If the fiber is not found return null.
    if (fiber === null) return null;

    // If There is no alternate we can return here.
    if (fiber.alternate === null || parentFiber.alternate === null) {
      return fiber;
    }

    // Remove the alternate.
    if (typeof child === 'number') {
      removeChildFiberAt(parentFiber.alternate, child);
    } else {
      removeChildFiber(parentFiber.alternate, child);
    }

    return fiber;
  }

  /**
   * Remove a child from this instance and add it to the provided ParentFiber instance.
   * Return the index in which the child is added (or -1).
   * The child to remove can be chosen by providing its key (string) or by providing its index (number).
   * Return -1 if the child is not found.
   * The position can be chosen by providing a key (string) or by providing an index (number).
   * If a key (string) is provided the child will be added after the one with that key.
   * - The child is added at the bottom if none of the children have that key.
   * If an index (number) is provided the child will be added in that position.
   * - The child is added at the bottom if -1 is provided or the index is greater than the number of children.
   * If skipUpdate is not used, this method will also send the element instance.
   *
   * @param child - The child identifier.
   * @param toParent - The ParentFiber instance to sent the child to.
   * @param position - The position to send the child to.
   * @param skipUpdate - Whether to send or not the element instance.
   * @returns - The position in which the fiber is sent or -1.
   */
  send(
    child: string | number,
    toParent: ParentFiber,
    position: string | number,
    skipUpdate?: boolean
  ): number {
    // Remove the fiber.
    const fiber = this.remove(child);
    // Return -1 if the fiber does not exist.
    if (fiber === null) return -1;
    // Add the fiber.
    const index = toParent.add(fiber, position);

    if (!skipUpdate) {
      // Container instances
      const fromContainer = findContainerInstanceFiber<Element>(
        this.fiber,
        ENV.isElement
      );
      const toContainer = findContainerInstanceFiber<Element>(
        toParent.fiber,
        ENV.isElement
      );

      // Warnings are removed in production.
      warning(
        fromContainer !== null && toContainer !== null,
        'Cannot find a container element, neither the parent nor any component before it seems to generate an element instance. ' +
          'You should manually send the element and use the "skipUpdate" option'
      );

      // Container not found.
      if (fromContainer === null || toContainer === null) return index;

      // Elements instances.
      const element = findInstanceFiber<Element>(fiber, ENV.isElement);
      const sibling = findInstanceFiber<Element>(fiber.sibling, ENV.isElement);

      // Warnings are removed in production.
      warning(
        element !== null && (fiber.sibling === null || sibling !== null),
        'Cannot find the child element instance. ' +
          'You should manually move the elements you are trying to send and use the "skipUpdate" option.'
      );

      // Elements not found.
      if (element === null || (fiber.sibling !== null && sibling === null))
        return index;

      // Remove the element instance.
      ENV.removeChildFromContainer(fromContainer.stateNode, element.stateNode);

      // Add the element instance
      if (sibling === null) {
        ENV.appendChildToContainer(toContainer.stateNode, element.stateNode);
      } else {
        ENV.insertInContainerBefore(
          toContainer.stateNode,
          element.stateNode,
          sibling.stateNode
        );
      }
    }

    return index;
  }

  /**
   * Clear the parent fiber.
   */
  clear(): void {
    this.fiber = null;
  }
}
