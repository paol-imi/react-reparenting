import type { Component } from 'react';
import type { Fiber } from 'react-reconciler';
import { ParentFiber } from './parentFiber';
/**
 * Generate a ParentFiber instance given a class instance of a component.
 * If the class component is not the parent, it is possible to provide
 * a function to get the correct parent given the class component fiber.
 *
 * @param instance  - The class instance.
 * @param findFiber - Get a different parent fiber.
 * @returns         - The ParentFiber instance.
 */
export declare function createParent(instance: Component, findFiber?: (fiber: Fiber) => Fiber): ParentFiber;
