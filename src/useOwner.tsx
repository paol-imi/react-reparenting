import type { Fiber } from 'react-reconciler';
import type { ReactElement } from 'react';
import type { WorkSlot } from './work';
import { Children, useCallback, useEffect, useRef } from 'react';
import {
  beginWork,
  createWorkSlot,
  existUncommitedWork,
  rollbackWork,
} from './work';

export type SpaceSlice = ReactElement | ReactElement[];

// TO ACHIEVE REPARENTING WITHOUT TOUCHING THE RECONCILER LOGIC, WE WILL MODIFY THE REACT INTERNALS A RENDRER TIME.
// THIS WILL NEED THE USE OF SOME PARADIGM THAT IS OFTEN DISCOURAGED / FORBIDDEN IN THE REACT, like side effects on render
// HOPEFULLY, THOSE are sufficient but not necessary CONSTRAINT to make REACT WORKS PROPERLY, and we WILL TRY to MET ALL THE REACT HEURISTICS
export function useOwnerSpace(slices: SpaceSlice[]): ReactElement[] {
  // FIXME: NOT USE ARRAY?
  // EACH POSITION CORRESPOND TO THE PARENT WITH THE SAME INDEX,
  // WHEN A PARENT MOUNTS IT SET IT, WHEN UNMOUNTS, IT SETS ITS POSITION TO NULL
  const lastMountedParentFibers = useRef<(Fiber | null)[]>([]).current;
  // EACH POSITION CORRESPOND TO THE PARENT WITH THE SAME INDEX,
  // WE FULLIFY THOSE SLOTS ONLY FOR THE PARENTS THAT NEED TO WORK
  // THIS WILL BE MUTATED A RENDER TIME, SINCE WE NEED TO REPRESENT THE RENDER WORK STATE
  // WE WILL TAKE CARE TO ROLLBACK ALL UNCOMMITED WORK WHEN A RENDER IS DISCARDED
  // TODO: MERGE WORK SLOTS ANS THIS? NAAAAH
  const workSlots = useRef<(WorkSlot | void)[]>([]).current;

  if (__DEV__) {
    if (existElementWithNoKey(slices)) console.error('');
    if (existDuplicateKey(slices)) throw new Error('');
  }

  if (__DEV__) {
    // DEV ONLY USE EFFECT; SAFE TO WRAP IN AN IF STATEMENT
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      // FIXME: CHECK FOR RENDER COUNT TO ENSURE CONSTRINT
      // THE OUTSIDE OF __DEV__ check flo UNCMITTED WORK AND MARK IT AS INTERNAL ERROR; please file an issue
      if (existUncommitedWork(workSlots)) throw new Error('');
      console.error('all non memoized child have bee rendered exactly once');
      console.error('all memoized child have bee rendered at most once');
    });
  }

  if (existUncommitedWork(workSlots)) {
    rollbackWork(workSlots);
  }

  // Since we wrap the the elements as design choise, we have to reapply
  // memoization to wrapped component
  // THIS METHOD IS NOT PURE SINCE WE RELY ON THE FACT THAT A IF THE PARENT IS MEMOIZED IT WON'T HAVE ANY WORK SLOTS, IT WILL ONLY NEED TO ACCESS lastMountedParentFibers,
  // and that reference is stable.
  // THIS WAY WE ARE ABLE TO PRESERVE MEMOIZATION AND IMPROVE PERFORMANCE
  const children = useMemoMap(slices, (slice, index) => (
    // INDEX ARE VALID AS KEY SINCE WE DISTINGUISH PARENT BY THEIR POSITION
    // WE RELY ON MEMOIZATION TO OPTIMIZE THE WORK SLOT CREATION
    <Parent workSlot={createWorkSlot(workSlots, index)} key={index}>
      {slice}
    </Parent>
  ));

  // AFTER WE HAVE GENERATED THE SLOTS
  // FIXME: find naming constraints and find better name
  beginWork(workSlots); // or beginWork(workSLots)

  return children;
}

/**
 *
 * @param array
 * @param callback - MUST BE PURE
 * @returns
 */
export function useMemoMap<S, T>(
  array: S[],
  callback: (value: S, index: number) => T
) {
  const oldArrayRef = useRef<S[]>([]);
  const oldResultRef = useRef<T[]>([]);

  const result = array.map((value, index) =>
    value === oldArrayRef.current[index]
      ? oldResultRef.current[index]
      : callback(value, index)
  );

  useEffect(() => {
    oldArrayRef.current = array;
    oldResultRef.current = result;
  });

  return result;
}

export function hasKeyCollision(slices: SpaceSlice[]) {
  const set = new Set();

  Children.array.forEach((element) => {
    if (key === null) invariant(set.has(element.k));
  });
}
