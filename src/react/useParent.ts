import {useEffect, useRef} from 'react';
import type {Fiber} from 'react-reconciler';
import {ParentFiber} from './parentFiber';
import {getCurrentOwner} from './currentFiber';
import {invariant} from '../invariant';

/**
 * An hook to get a ParentFiber instance in a function component.
 * The ref returned must reference the element that is the parent
 * of the children to reparent (it is possible to get around this by providing a findFiber method).
 *
 * @param findFiber - Get a different parent fiber.
 * @returns         - The ParentFiber instance.
 */
export function useParent(findFiber?: (fiber: Fiber) => Fiber): ParentFiber {
  // The parent instance.
  const parentRef = useRef<ParentFiber | null>(null);

  // Generate the instance.
  if (parentRef.current === null) {
    parentRef.current = new ParentFiber();

    const owner = getCurrentOwner();
    invariant(
      owner !== null,
      'This is likely a bug in React-Reparenting. ' +
        'Please file an issue https://github.com/Paol-imi/react-reparenting/issues.'
    );

    parentRef.current.setFiber(owner);
  }

  parentRef.current.setFinder(findFiber);

  // When the component is mounted the fiber is set.
  useEffect(() => () => parentRef.current?.clear(), []);

  return parentRef.current;
}
