import type { Component } from 'react';
import type { Fiber } from 'react-reconciler';
/**
 * The fiber could be in the current tree or in the work-in-progress tree.
 * Return the fiber in the current tree, it could be the given fiber or its alternate.
 *
 * @param fiber - The fiber.
 * @returns - The current fiber.
 */
export declare function getCurrentFiber(fiber: Fiber): Fiber;
/**
 * Get the fiber of the given element.
 *
 * @param element - The element.
 * @returns - The fiber.
 */
export declare function getFiberFromElementInstance<T>(element: T): Fiber;
/**
 * Get the fiber of the given class component instance.
 *
 * @param instance - The class component instance.
 * @returns - The fiber.
 */
export declare function getFiberFromClassInstance(instance: Component): Fiber;
