import type { Fiber } from 'react-reconciler';
/**
 * Remove a child from its parent and return it.
 * The child to remove can be chosen by providing its key (string) or its index (number).
 * The method will also try to remove the elements connected to the child (e.g. DOM elements),
 * it is possible to disable this function using the skipUpdate parameter.
 * If the child is not found null is returned.
 *
 * @param parent        - The parent from which to remove the child.
 * @param childSelector - The child selector.
 * @param skipUpdate    - Whether to add or not the elements.
 * @returns             - The removed child or null.
 */
export declare function removeChild(parent: Fiber, childSelector: string | number, skipUpdate?: boolean): Fiber | null;
