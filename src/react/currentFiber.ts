import type {Fiber} from 'react-reconciler';
import React from 'react';
import {invariant} from '../invariant';

/**
 * The fiber could be in the current tree or in the work-in-progress tree.
 * Return the fiber in the current tree, it could be the given fiber or its alternate.
 * For now, no special cases are handled.
 * (React.reconciler code https://github.com/facebook/react/blob/master/packages/react-reconciler/src/ReactFiberTreeReflection.js#L127).
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
 * Returns the current owner.
 *
 * @returns - The owner.
 */
export function getCurrentOwner(): Fiber | null {
  return (React as any).__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED
    .ReactCurrentOwner.current;
}
