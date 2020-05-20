import type { Fiber } from 'react-reconciler';
/**
 * Remove a child fiber from its parent fiber and return it.
 * The child to remove can be chosen by providing its key (string) or by
 * providing its index (number).
 * The method will also try to remove the elements connected to the fibers (e.g. DOM elements),
 * to disable this function you can use the skipUpdate parameter.
 * If the child is not found null is returned.
 *
 * @param parent        - The parent fiber from which to remove the child fiber.
 * @param childSelector - The child fiber selector.
 * @param skipUpdate    - Whether to add or not the elements.
 * @returns             - The removed child fiber or null.
 */
export declare function removeChild(parent: Fiber, childSelector: string | number, skipUpdate?: boolean): Fiber | null;
