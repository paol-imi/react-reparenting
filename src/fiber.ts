import type { Fiber } from 'react-reconciler';
import type { Component } from 'react';
import { version } from 'react';

const componentAttribute = version.startsWith('16')
  ? // React 16.x.x
    '_reactInternalFiber'
  : // React 17.x.x | 18.x.x
    '_reactInternals';

/**
 * Returns the fiber of the given class component instance.
 *
 * @param instance  - The class component instance.
 * @returns         - The fiber.
 */
export function getFiberFromClassInstance(instance: Component): Fiber {
  if (!(componentAttribute in instance)) {
    'Cannot find the ${Int.componentAttribute}. ' +
      'This is a problem with React-reparenting, please file an issue.';
  }

  // The internal fiber is not present in the types definition.
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return instance[componentAttribute];
}
