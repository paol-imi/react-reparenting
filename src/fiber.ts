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
    warning(
      '[react-reparenting]: Cannot find the ${Int.componentAttribute}. ' +
        'This is likely a problem with react-reparenting, please file an issue.'
    );
  }

  // @ts-expect-error the internal fiber is not present in the types definition.
  return instance[componentAttribute];
}

export function getCurrentFiberFromClassInstance(instance: Component): Fiber {
  const fiber = getFiberFromClassInstance(instance);

  return fiber.pendingProps === instance.props
    ? fiber
    : (fiber.alternate as Fiber);
}
