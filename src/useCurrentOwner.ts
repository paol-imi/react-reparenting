import type {Fiber} from 'react-reconciler';
import React from 'react';

export function useCurrentOwner(): Fiber {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (React as any).__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED
    .ReactCurrentOwner.current;
}
