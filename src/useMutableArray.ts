import { useEffect, useRef } from 'react';

export function useMutableArray<S>(newLength: number, factory: () => S) {
  const array = useRef<S[]>([]).current;

  // We add the new position at render time.
  if (newLength > array.length) {
    array.push(...new Array(newLength - array.length).map(factory));
  }

  useEffect(() => {
    // we remove the old position on effect
    if (newLength < array.length) {
      array.length = newLength;
    }
  });

  return array;
}
