import type {Fiber} from 'react-reconciler'; // eslint-disable-line

/**
 * Returns an array containing the ordered indices of the fibers children (cycling the siblings).
 *
 * @param parent - The parent fiber.
 * @returns - The indices.
 */
export function getFibersIndices(parent: Fiber): number[] {
  let {child} = parent;

  const keys: number[] = [];

  if (child === null) return keys;

  while (child) {
    keys.push(child.index);
    child = child.sibling;
  }

  return keys;
}
