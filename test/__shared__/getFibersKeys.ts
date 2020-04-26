import type {Key} from 'react';
import type {Fiber} from 'react-reconciler'; // eslint-disable-line

/**
 * Returns an array containing the ordered keys of the fibers children (cycling the siblings).
 *
 * @param parent - The parent fiber.
 * @returns - The keys.
 */
export function getFibersKeys(parent: Fiber): Key[] {
  let {child} = parent;

  const keys: Key[] = [];

  if (child === null) return keys;

  while (child) {
    keys.push(child.key);
    child = child.sibling;
  }

  return keys;
}
