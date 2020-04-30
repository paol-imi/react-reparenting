import type { Component } from 'react';
import type { Fiber } from 'react-reconciler';
/**
 * The fiber could be in the current tree or in the work-in-progress tree.
 * Returns the fiber in the current tree, it could be the given fiber or its alternate.
 * For now, no special cases are handled:
 * - It doesn't make sense to manage portals as this package was created to avoid them.
 *
 * @param fiber - The fiber.
 * @returns - The current fiber.
 */
export declare function getCurrentFiber(fiber: Fiber): Fiber;
/**
 * Returns the fiber of the given element (for now limited to DOM nodes).
 *
 * @param element - The element.
 * @returns - The fiber.
 */
export declare function getFiberFromElementInstance<T>(element: T): Fiber;
/**
 * Returns the fiber of the given class component instance.
 *
 * @param instance - The class component instance.
 * @returns - The fiber.
 */
export declare function getFiberFromClassInstance(instance: Component): Fiber;
