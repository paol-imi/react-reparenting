import type { Fiber } from 'react-reconciler';
/**
 * The fiber could be in the current tree or in the work-in-progress tree.
 * Return the fiber in the current tree, it could be the given fiber or its alternate.
 * For now, no special cases are handled.
 * (React.reconciler code https://github.com/facebook/react/blob/master/packages/react-reconciler/src/ReactFiberTreeReflection.js#L127).
 *
 * @param fiber - The fiber.
 * @returns     - The current fiber.
 */
export declare function getCurrentFiber(fiber: Fiber): Fiber;
/**
 * Returns the current owner.
 *
 * @returns - The owner.
 */
export declare function getCurrentOwner(): Fiber | null;
