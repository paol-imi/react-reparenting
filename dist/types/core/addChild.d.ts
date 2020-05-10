import type { Fiber } from 'react-reconciler';
/**
 * Add a child fiber in a parent fiber and return the index in which it is added.
 * The position can be chosen by providing a key (string) or by providing an index (number).
 * If a key (string) is provided the child will be added after the one with that key.
 * The child is added at the bottom if none of the children have that key.
 * If an index (number) is provided the child will be added in that position.
 * The child is added at the bottom if -1 is provided or the index is greater
 * than the number of children.
 *
 * @param parent    - The parent fiber in which to add the child fiber.
 * @param child     - The child fiber to add.
 * @param position  - The position in which to add the child fiber.
 * @returns         - The index in which the child fiber is added.
 */
export declare function addChild(parent: Fiber, child: Fiber, position: string | number): number;
