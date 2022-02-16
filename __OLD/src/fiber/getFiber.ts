import type {Component} from 'react';
import type {Fiber} from 'react-reconciler';
import {Int} from '../env/internals';
import {invariant} from '../invariant';

/**
 * Return the first valid fiber or null.
 *
 * @param fiber - The fiber to start looking for.
 * @param next  - The callback to get the next fiber to iterate.
 * @param stop  - The callback to check if the fiber is found.
 * @returns     - The found fiber or null.
 */
export function getFiberFromPath(
  fiber: Fiber | null,
  next: (current: Fiber) => Fiber | null,
  stop: (current: Fiber) => boolean
): Fiber | null {
  while (fiber) {
    if (stop(fiber)) {
      return fiber;
    }

    // Search in the next instance.
    fiber = next(fiber);
  }

  return null;
}

/**
 * The fiber could be in the current tree or in the work-in-progress tree.
 * Return the fiber in the current tree, it could be the given fiber or its alternate.
 * For now, no special cases are handled (It doesn't make sense to manage
 * portals as this package was created to avoid them).
 *
 * @param fiber - The fiber.
 * @returns     - The current fiber.
 */
export function getCurrentFiber(fiber: Fiber): Fiber {
  // If there is no alternate we are shure that it is the current fiber.
  if (fiber.alternate === null) {
    return fiber;
  }

  // Get the top fiber.
  let topFiber = fiber;
  while (topFiber.return !== null) {
    topFiber = topFiber.return;
  }

  // The top fiber must be an HoostRoot.
  invariant(
    topFiber.stateNode !== null && 'current' in topFiber.stateNode,
    'Unable to find node on an unmounted component.'
  );

  const rootFiber = topFiber.stateNode;
  const topCurrentFiber = rootFiber.current;

  // If true we are in the current tree.
  return topCurrentFiber === topFiber ? fiber : fiber.alternate;
}

/**
 * Returns the fiber of the given class component instance.
 *
 * @param instance  - The class component instance.
 * @returns         - The fiber.
 */
export function getFiberFromClassInstance(instance: Component): Fiber {
  invariant(
    Int.componentAttribute in instance,
    'Cannot find the _reactInternalFiber. ' +
      'This is a problem with React-reparenting, please file an issue.'
  );

  // The internal fiber is not present in the types definition.
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return instance[Int.componentAttribute];
}
