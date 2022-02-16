import type {Key} from 'react';
import type {Fiber} from 'react-reconciler';
import {invariant} from '../../src/invariant';

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

/**
 * Returns an array containing the ordered keys of the fibers children (cycling the siblings).
 *
 * @param parent  - The parent fiber.
 * @returns       - The keys.
 */
export function getFibersKeys(parent: Fiber): Key[] {
  let {child} = parent;

  // Fibers keys.
  const keys: Key[] = [];

  // Return an empty array if the parent has no children.
  if (child === null) return keys;

  while (child) {
    invariant(child.key !== null);
    keys.push(child.key);
    child = child.sibling;
  }

  return keys;
}

/**
 * Return the id of the children of the given container element.
 *
 * @param container - The container element.
 * @returns         - The ids of the children.
 */
export function getChildrenIds(container: HTMLElement): string[] {
  const children = Array.from(container.children);
  return children.map((child) => child.getAttribute('id')) as string[];
}
