import {useRef, useEffect, useState} from 'react';
import type {RefObject} from 'react';
import type {Fiber} from 'react-reconciler'; // eslint-disable-line
import {ParentFiber} from '../core/parentFiber';
import {getFiberFromElementInstance} from '../utils/getFiber';
import {invariant} from '../invariant';

/**
 * An hook to easily use a ParentFiber inside a function component.
 * The ref returned must reference the element that is the parent
 * of the children to reparent.
 *
 * @param findFiber - Get a different parent fiber.
 * @returns - [The ParentFiber instance, the element ref].
 */
export function useParent<T>(
  findFiber?: (fiber: Fiber) => Fiber
): [ParentFiber, RefObject<T>] {
  // The parent instance.
  const [parent] = useState<ParentFiber>(() => new ParentFiber());
  // The element ref.
  const ref = useRef<T>(null);

  // When the component is mounted the fiber is setted.
  useEffect(() => {
    invariant(
      ref.current !== null,
      'You must set the ref returned by the useParent hook'
    );
    // The element fiber.
    const elementFiber = getFiberFromElementInstance(ref.current);

    // Set the fiber.
    if (typeof findFiber === 'function') {
      parent.setFiber(findFiber(elementFiber));
    } else {
      parent.setFiber(elementFiber);
    }

    // Clean up.
    return (): void => {
      parent.clear();
    };
  }, []);

  return [parent, ref];
}
