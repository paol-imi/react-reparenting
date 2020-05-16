import {useRef, useEffect} from 'react';
import type {RefObject} from 'react';
import type {Fiber} from 'react-reconciler';
import {ParentFiber} from './parentFiber';
import {getFiberFromElementInstance} from '../fiber/getFIber';
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
  const parentRef = useRef<ParentFiber>(null);
  // The element ref.
  const ref = useRef<T>(null);

  // Generate the instance.
  if (parentRef.current === null) {
    // TODO: Not so pretty solution with @ts-ignore,
    // maybe I should try the MutableRefObject interface.
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    parentRef.current = new ParentFiber();
  }

  // Get a reference.
  const parent = parentRef.current;
  parent.setFinder(findFiber);

  // When the component is mounted the fiber is setted.
  useEffect(() => {
    invariant(
      ref.current !== null,
      'You must set the ref returned by the useParent hook.'
    );

    // The element fiber.
    parent.setFiber(getFiberFromElementInstance<T>(ref.current));

    // Clean up.
    return (): void => {
      parent.clear();
    };
  }, []);

  return [parent, ref];
}
