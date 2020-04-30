import type {Component} from 'react';
import type {Fiber} from 'react-reconciler'; // eslint-disable-line
import {ParentFiber} from '../core/parentFiber';
import {getFiberFromClassInstance} from '../fiber/get';

/**
 * Generate a ParentFiber instance given a class instance of a component.
 * If the class component is not the parent, it is possible to provide
 * a function to get the correct parent given the class component fiber.
 *
 * @param instance - The class instance.
 * @param findFiber - Get a different parent fiber.
 * @returns - The ParentFiber instance.
 */
export function createParent(
  instance: Component,
  findFiber?: (fiber: Fiber) => Fiber
): ParentFiber {
  const parent = new ParentFiber();
  const {componentDidMount, componentWillUnmount} = instance;

  // Wrap the componentDidMount method.
  instance.componentDidMount = function (): void {
    const fiber = getFiberFromClassInstance(instance);
    // Set the fiber.
    if (typeof findFiber === 'function') {
      parent.set(findFiber(fiber));
    } else {
      parent.set(fiber);
    }

    // Call the original method.
    if (typeof componentDidMount === 'function') {
      componentDidMount.call(this);
    }
  };

  // Wrap the componentDidMount method.
  instance.componentWillUnmount = function (): void {
    // Call the original method.
    if (typeof componentWillUnmount === 'function') {
      componentWillUnmount.call(this);
    }
    // Clear the parent.
    parent.clear();
  };

  return parent;
}
