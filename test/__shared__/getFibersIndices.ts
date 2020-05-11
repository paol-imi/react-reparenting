import type {Fiber} from 'react-reconciler';

/**
 * Returns an array containing the ordered indices of the fibers children (cycling the siblings).
 *
 * @param parent  - The parent fiber.
 * @returns       - The indices.
 */
export function getFibersIndices(parent: Fiber): number[] {
  let {child} = parent;

  // Fibers indices.
  const indices: number[] = [];

  // Return an empty array if the parent has no children.
  if (child === null) return indices;

  while (child) {
    indices.push(child.index);
    child = child.sibling;
  }

  return indices;
}
