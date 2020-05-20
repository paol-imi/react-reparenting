/**
 * Return the id of the children of the given container element.
 *
 * @param container - The container element.
 * @returns         - The ids of the children.
 */
export function getChildrenIds(container: HTMLElement): string[] {
  const children = Array.from(container.children);
  return children.map((child) => child.getAttribute('id'));
}
