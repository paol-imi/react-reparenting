import React, {MutableRefObject, useEffect, useRef} from 'react';
import type {ReactNode, RefObject} from 'react';
import type {Fiber} from 'react-reconciler';
import {getCurrentOwner, ParentFiber} from '../../src';
import {invariant} from '../../src/invariant';

/**
 * Custom component that accepts some lifecycle callback.
 */
export function Parent({fiberRef, parentFiberRef, children}: ParentProps) {
  const ownerRef = useRef(getCurrentOwner());

  useEffect(() => {
    invariant(ownerRef.current !== null && ownerRef.current.child !== null);

    if (fiberRef)
      (fiberRef as MutableRefObject<Fiber>).current = ownerRef.current.child;
    if (parentFiberRef)
      (parentFiberRef as MutableRefObject<
        ParentFiber
      >).current = new ParentFiber(ownerRef.current.child);
  }, []);

  return <div>{children}</div>;
}

/** Child props. */
export type ParentProps = {
  /** The id of the element. */
  children?: ReactNode;
  /** Refs. */
  fiberRef?: RefObject<Fiber>;
  parentFiberRef?: RefObject<ParentFiber>;
};
