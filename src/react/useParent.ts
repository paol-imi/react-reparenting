import {useEffect, useRef} from 'react';
import type {RefObject} from 'react';
import type {Fiber} from 'react-reconciler';
import {ParentFiber} from './parentFiber';
import {getFiberFromElementInstance} from '../fiber/getFIber';
import {invariant} from '../invariant';

/**
 * An hook to get a ParentFiber instance in a function component.
 * The ref returned must reference the element that is the parent
 * of the children to reparent (it is possible to get around this by providing a findFiber method).
 *
 * @param findFiber - Get a different parent fiber.
 * @returns - The ParentFiber instance.
 */
export function useParent<T>(
  ref: RefObject<T>,
  findFiber?: (fiber: Fiber) => Fiber
): ParentFiber {
  // The parent instance.
  const parentRef = useRef<ParentFiber | null>(null);

  // Generate the instance.
  if (parentRef.current === null) {
    parentRef.current = new ParentFiber();
  }

  // Get a reference.
  const parent = parentRef.current;
  parent.setFinder(findFiber);

  // When the component is mounted the fiber is set.
  useEffect(() => {
    invariant(
      ref.current !== null && ref.current !== undefined,
      'You must set the ref returned by the useParent hook.'
    );

    // The element fiber.
    parent.setFiber(getFiberFromElementInstance<T>(ref.current));

    // Clean up.
    return (): void => {
      parent.clear();
    };
  }, []);

  return parent;
}
