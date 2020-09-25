import React, {MutableRefObject, useEffect, useState} from 'react';
import type {RefObject} from 'react';
import type {Fiber} from 'react-reconciler';
import {getCurrentOwner} from '../../src';

/**
 * Custom component that accepts some lifecycle callback.
 */
export function Child({
  stateRef,
  fiberRef,
  onRender,
  onMount,
  onUnmount,
  id,
}: ChildProps) {
  const [state] = useState(Math.random);

  if (stateRef) (stateRef as MutableRefObject<number>).current = state;
  if (fiberRef)
    (fiberRef as MutableRefObject<Fiber | null>).current = getCurrentOwner();

  if (onRender) onRender();
  useEffect(() => {
    if (onMount) onMount();
    return () => {
      if (onUnmount) onUnmount();
    };
  }, []);

  return <div id={id} className="child" />;
}

/** Child props. */
export type ChildProps = {
  /** The id of the element. */
  id?: string;
  /** Refs. */
  stateRef?: RefObject<number>;
  fiberRef?: RefObject<Fiber>;
  /** Callbacks. */
  onRender?: () => void;
  onMount?: () => void;
  onUnmount?: () => void;
};
