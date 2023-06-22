import { useEffect, useRef } from 'react';

/**
 *
 * @param array
 * @param callback - MUST BE PURE w.r.t deps
 * @returns
 */
export function useMemoMap<S, T>(
  array: S[],
  callback: (oldValue: S, newValue: S, index: number) => T,
  deps: unknown[]
) {
  const oldDeps = useRef(deps);
  const oldArrayRef = useRef<S[]>([]);
  const oldResultRef = useRef<T[]>([]);

  const result = array.map((newValue, index) => {
    const oldValue = oldArrayRef.current[index];

    return newValue === oldValue && equal(deps, oldDeps.current)
      ? oldResultRef.current[index]
      : callback(oldValue, newValue, index);
  });

  useEffect(() => {
    oldDeps.current = deps;
    oldArrayRef.current = array;
    oldResultRef.current = result;
  });

  return result;
}

function equal(a: unknown[], b: unknown[]) {
  return a.every((dep, i) => dep === b[i]);
}
