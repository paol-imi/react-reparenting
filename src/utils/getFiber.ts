import type {Component} from 'react';
import type {Fiber} from 'react-reconciler'; // eslint-disable-line
import {invariant} from '../invariant';

/**
 * The fiber could be in the current tree or in the work-in-progress tree.
 * Return the fiber in the current tree, it could be the given fiber or its alternate.
 *
 * @param fiber - The fiber.
 * @returns - The current fiber.
 */
export function getCurrentFiber(fiber: Fiber): Fiber {
  // If there is no alternate we are shure that it is the current fiber.
  if (!fiber.alternate) return fiber;

  // Get the top fiber.
  let topFiber = fiber;
  while (topFiber.return) {
    topFiber = topFiber.return;
  }

  // Fibers.
  const rootFiber = topFiber.stateNode;
  const topCurrentFiber = rootFiber.current;

  // If true we are in the current tree.
  return topCurrentFiber === topFiber ? fiber : fiber.alternate;
}

/**
 * Get the fiber of the given element.
 *
 * @param element - The element.
 * @returns - The fiber.
 */
export function getFiberFromElementInstance<T>(element: T): Fiber {
  const internalKey = Object.keys(element).find((key) =>
    key.startsWith('__reactInternalInstance$')
  );

  invariant(
    typeof internalKey === 'string',
    'Cannot find the __reactInternalInstance$'
  );

  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  // The __reactInternalInstance$* is not present in the types definition.
  return element[internalKey];
}

/**
 * Get the fiber of the given class component instance.
 *
 * @param instance - The class component instance.
 * @returns - The fiber.
 */
export function getFiberFromClassInstance(instance: Component): Fiber {
  invariant(
    typeof instance === 'object' && '_reactInternalFiber' in instance,
    'Cannot find the _reactInternalFiber'
  );

  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  // The _reactInternalFiber is not present in the types definition.
  return instance._reactInternalFiber;
}
