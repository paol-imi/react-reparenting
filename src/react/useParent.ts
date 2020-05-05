import {useRef, useEffect} from 'react';
import type {RefObject} from 'react';
import type {Fiber} from 'react-reconciler'; // eslint-disable-line
import {ParentFiber} from '../core/parentFiber';
import {getFiberFromElementInstance} from '../fiber/get';
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
    // TODO: Not so pretty solution,
    // when I will have time I'll try and implement the interface MutableRefObject.
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    parentRef.current = new ParentFiber();
  }

  // Get a reference.
  const parent = parentRef.current;

  // When the component is mounted the fiber is setted.
  useEffect(() => {
    invariant(
      ref.current !== null,
      'You must set the ref returned by the useParent hook'
    );

    // The element fiber.
    const elementFiber = getFiberFromElementInstance<T>(ref.current);

    // Set the fiber.
    if (typeof findFiber === 'function') {
      parent.set(findFiber(elementFiber));
    } else {
      parent.set(elementFiber);
    }

    // Clean up.
    return (): void => {
      parent.clear();
    };
  }, []);

  return [parent, ref];
}
