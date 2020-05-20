import type { Fiber } from 'react-reconciler';
/**
 * Add a child fiber in a parent fiber and return the index in which it is added.
 * The position can be chosen by providing a key (string) or by providing an index (number).
 * If a key (string) is provided the child will be added after the one with that key.
 * The child is added at the bottom if none of the children have that key.
 * If an index (number) is provided the child will be added in that position.
 * The child is added at the bottom if -1 is provided or the index is greater
 * than the number of children.
 * The method will also try to add the elements connected to the fibers (e.g. DOM elements),
 * to disable this function you can use the skipUpdate parameter.
 *
 * @param parent      - The parent fiber in which to add the child fiber.
 * @param child       - The child fiber to add.
 * @param position    - The position in which to add the child fiber.
 * @param skipUpdate  - Whether to add or not the elements.
 * @returns           - The index in which the child fiber is added.
 */
export declare function addChild(parent: Fiber, child: Fiber, position: string | number, skipUpdate?: boolean): number;
