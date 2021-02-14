import type { Component } from 'react';
import type { Fiber } from 'react-reconciler';
/**
 * Return the first valid fiber or null.
 *
 * @param fiber - The fiber to start looking for.
 * @param next  - The callback to get the next fiber to iterate.
 * @param stop  - The callback to check if the fiber is found.
 * @returns     - The found fiber or null.
 */
export declare function getFiberFromPath(fiber: Fiber | null, next: (current: Fiber) => Fiber | null, stop: (current: Fiber) => boolean): Fiber | null;
/**
 * The fiber could be in the current tree or in the work-in-progress tree.
 * Return the fiber in the current tree, it could be the given fiber or its alternate.
 * For now, no special cases are handled (It doesn't make sense to manage
 * portals as this package was created to avoid them).
 *
 * @param fiber - The fiber.
 * @returns     - The current fiber.
 */
export declare function getCurrentFiber(fiber: Fiber): Fiber;
/**
 * Returns the fiber of the given element (for now limited to DOM nodes).
 *
 * @param element - The element.
 * @returns       - The fiber.
 */
export declare function getFiberFromElementInstance<T extends Node>(element: T): Fiber;
/**
 * Returns the fiber of the given class component instance.
 *
 * @param instance  - The class component instance.
 * @returns         - The fiber.
 */
export declare function getFiberFromClassInstance(instance: Component): Fiber;
