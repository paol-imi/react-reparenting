import type { Fiber } from 'react-reconciler';
/**
 * Add a child in a parent and return the index in which it is added.
 * The position of the child can be chosen by providing a key (string) or an index (number).
 * If a key (string) is provided the child will be added after the one with that key.
 * The child is added at the bottom if none of the children have that key.
 * If an index (number) is provided the child will be added in that position.
 * The child is added at the bottom if -1 is provided or the index is greater
 * than the number of children.
 * The method will also try to add the elements connected to the child (e.g. DOM elements),
 * it is possible to disable this function using the skipUpdate parameter.
 *
 * @param parent      - The parent in which to add the child.
 * @param child       - The child to add.
 * @param position    - The position in which to add the child.
 * @param skipUpdate  - Whether to add or not the elements.
 * @returns           - The index in which the child is added.
 */
export declare function addChild(parent: Fiber, child: Fiber, position: string | number, skipUpdate?: boolean): number;
