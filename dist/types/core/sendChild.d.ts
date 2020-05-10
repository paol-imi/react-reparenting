import type { Fiber } from 'react-reconciler';
/**
 * Remove a child fiber from a parent fiber and add it to another parent fiber.
 * Return the index in which the child is added or -1 if the child is not found.
 * The child to remove can be chosen by providing its key (string) or by providing its index (number).
 * The position can be chosen by providing a key (string) or by providing an index (number).
 * If a key (string) is provided the child will be added after the one with that key.
 * The child is added at the bottom if none of the children have that key.
 * If an index (number) is provided the child will be added in that position.
 * The child is added at the bottom if -1 is provided or the index is greater than the number of children.
 * The method will also try to send the elements connected to the fibers (e.g. DOM elements),
 * to disable this function you can use the skipUpdate parameter.
 *
 * @param fromParent    - The parent fiber from which to remove the child fiber.
 * @param toParent      - The parent fiber in which to add the child fiber.
 * @param childSelector - The child fiber selector.
 * @param position      - The position in which to add the child fiber.
 * @param skipUpdate    - Whether to send or not the elements.
 * @returns             - The position in which the child fiber is sent or -1.
 */
export declare function sendChild(fromParent: Fiber, toParent: Fiber, childSelector: string | number, position: string | number, skipUpdate?: boolean): number;
