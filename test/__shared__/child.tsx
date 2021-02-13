import type {RefObject} from 'react';
import React, {MutableRefObject, useEffect, useState} from 'react';

/**
 * Custom component that accepts some lifecycle callback.
 */
export function Child({
  stateRef,
  onRender,
  onMount,
  onUnmount,
  id,
}: ChildProps): JSX.Element {
  const [state] = useState(Math.random);

  if (stateRef) (stateRef as MutableRefObject<number>).current = state;

  onRender();
  useEffect(() => {
    onMount();
    return () => {
      onUnmount();
    };
  }, []);

  return <div id={id} className="child" />;
}

/** Child props. */
export type ChildProps = {
  /** The id of the element. */
  id?: string;
  /** The state ref. */
  stateRef?: RefObject<number>;
  /** Callbacks. */
  onRender: () => void;
  onMount: () => void;
  onUnmount: () => void;
};
