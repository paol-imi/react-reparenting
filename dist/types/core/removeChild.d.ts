import type { Fiber } from 'react-reconciler';
/**
 * Remove a child fiber from its parent fiber and return it.
 * The child to remove can be chosen by providing its key (string) or by
 * providing its index (number).
 * If the child is not found null is returned.
 *
 * @param parent        - The parent fiber from which to remove the child fiber.
 * @param childSelector - The child fiber selector.
 * @returns             - The removed child fiber or null.
 */
export declare function removeChild(parent: Fiber, childSelector: string | number): Fiber | null;
