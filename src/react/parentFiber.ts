import type {Fiber} from 'react-reconciler';
import {addChild} from '../core/addChild';
import {removeChild} from '../core/removeChild';
import {sendChild} from '../core/sendChild';
import {getCurrentFiber} from '../fiber/get';
import {invariant} from '../invariant';

/**
 * The ParentFiber implement the logic to manage a fiber of a parent component.
 * It provides simple methods for managing reparenting, such as add(), remove() and send().
 */
export class ParentFiber {
  /** The parent fiber. */
  fiber: Fiber | null = null;
  /** Find fiber method. */
  findFiber?: (fiber: Fiber) => Fiber;

  /**
   * Parent fiber setter.
   *
   * @param fiber - The parent fiber to manage.
   */
  setFiber(fiber: Fiber): void {
    this.fiber = fiber;
  }

  /**
   * FindFiber method setter.
   *
   * @param findFiber - The method.
   */
  setFinder(findFiber?: (fiber: Fiber) => Fiber): void {
    this.findFiber = findFiber;
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
      'Cannot call Parent methods before it is initialized.'
    );

    // Find the current fiber.
    const current = getCurrentFiber(this.fiber);

    return typeof this.findFiber === 'function'
      ? this.findFiber(current)
      : current;
  }

  /**
   * Add a child fiber in this instance and return the index in which it is added.
   * The position can be chosen by providing a key (string) or by providing an index (number).
   * If a key (string) is provided the child will be added after the one with that key.
   * The child is added at the bottom if none of the children have that key.
   * If an index (number) is provided the child will be added in that position.
   * The child is added at the bottom if -1 is provided or the index is greater
   * than the number of children.
   *
   * @param child     - The child fiber to add.
   * @param position  - The position in which to add the child fiber.
   * @returns         - The index in which the child fiber is added.
   */
  addChild(child: Fiber, position: string | number): number {
    return addChild(this.getCurrent(), child, position);
  }

  /**
   * Remove a child fiber from this instance and return it.
   * The child to remove can be chosen by providing its key (string) or by
   * providing its index (number).
   * If the child is not found null is returned.
   *
   * @param childSelector - The child fiber selector.
   * @returns             - The removed child fiber or null.
   */
  removeChild(childSelector: string | number): Fiber | null {
    return removeChild(this.getCurrent(), childSelector);
  }

  /**
   * Remove a child fiber from this instance and add it to another parent fiber.
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
   * @param parent        - The ParentFiber instance in which to add the child fiber.
   * @param childSelector - The child fiber selector.
   * @param position      - The position in which to add the child fiber.
   * @param skipUpdate    - Whether to send or not the elements.
   * @returns             - The position in which the child fiber is sent or -1.
   */
  sendChild(
    parent: ParentFiber,
    childSelector: string | number,
    position: string | number,
    skipUpdate?: boolean
  ): number {
    return sendChild(
      this.getCurrent(),
      parent.getCurrent(),
      childSelector,
      position,
      skipUpdate
    );
  }

  /**
   * Clear the parent fiber.
   */
  clear(): void {
    this.fiber = null;
  }
}
