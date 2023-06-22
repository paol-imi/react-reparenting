import type { ReactElement } from 'react';
import type { ContainerState } from './work';
import { useEffect, useRef } from 'react';
import { useMemoMap } from './useMemoMap';
import { useMutableArray } from './useMutableArray';
import { beginWorks, existUncommitedWork, rollbackWork } from './work';

export type OwnerSlot = ReactElement | ReactElement[];

// TO ACHIEVE REPARENTING WITHOUT TOUCHING THE RECONCILER LOGIC, WE WILL MODIFY THE REACT INTERNALS A RENDRER TIME.
// THIS WILL NEED THE USE OF SOME PARADIGM THAT IS OFTEN DISCOURAGED / FORBIDDEN IN THE REACT, like side effects on render
// HOPEFULLY, THOSE are sufficient but not necessary CONSTRAINT to make REACT WORKS PROPERLY, and we WILL TRY to MET ALL THE REACT HEURISTICS
export function useOwnerSlots<T = any>(
  slots: OwnerSlot[],
  hostConfig: HostConfig<T> = defaultDOMHostConfig
): ReactElement[] {
  // EACH POSITION CORRESPOND TO THE PARENT WITH THE SAME INDEX,
  // WHEN A PARENT MOUNTS IT SET IT, WHEN UNMOUNTS, IT SETS ITS POSITION TO NULL
  //
  // EACH POSITION CORRESPOND TO THE PARENT WITH THE SAME INDEX,
  // WE FULLIFY THOSE SLOTS ONLY FOR THE PARENTS THAT NEED TO WORK
  // THIS WILL BE MUTATED A RENDER TIME, SINCE WE NEED TO REPRESENT THE RENDER WORK STATE
  // WE WILL TAKE CARE TO ROLLBACK ALL UNCOMMITED WORK WHEN A RENDER IS DISCARDED
  // The reference to each subelement is stable, althoug the array length may change.
  // FIXME: we need reparenting information WITH THE ORDER THEY ARE PERFORMED
  //        IS THERE A BETTER WAY TO HANDLE THIS; AND MAYBE REMOVE LOG????
  const slotsStates = useMutableArray<SlotState>(slots.length, emptySlotState);

  if (__DEV__) {
    if (!hasSingleChild(slots) && hasElementWithNokey(slots)) {
      throw new Error('mamamamsmsmsmmsmsms');
    }

    if (existsDuplicateKey(slots)) {
      throw new Error('kskskkskskkskskkskskkskskskkskskkskks');
    }
  }

  // FIXME: only dev? performance? meeh
  if (__DEV__) {
    // DEV ONLY USE EFFECT; SAFE TO WRAP IN AN IF STATEMENT
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      // state.some(({ childrenFibersToAdd }) => childrenFibersToAdd !== null)
      if (slotsStates.some(didNotCommit)) {
        // ALL CHILD MUST BE RENDERED AT LEAST ONE TIME
        throw new Error('');
      }

      // state.some(({ renderCount }) => renderCount > 1)
      if (slotsStates.some(hasRenderedMultipleTimes)) {
        // ALL CHILD WITH WORK (NOT MEMOIZED) MUST BE RENDERED
        throw new Error('');
      }
    });
  }

  // FIXME: DO ONE OF THE 2:
  //  - find a way to represent the WHOLE state as committed / uncommitted (e.g. didCommitLastRender = useRef())
  //  - find a way to manage partially committed slots, even if it is not possible in react.
  //    non rendered + committed -> error, rendered + committed -> ?
  // TODO:
  if (slotsStates.some(didNotCommit)) {
    rollback(slotsStates);
  }
  // SET ALL RENDERCOUNT TO 0
  startLifecycle(slotsStates);

  //
  const diffs = new Array<Diff | null>(slots.length).fill(null);
  // Since we wrap the the elements as design choise, we have to reapply
  // memoization to wrapped component
  // THIS METHOD IS NOT PURE SINCE WE RELY ON THE FACT THAT A IF THE PARENT IS MEMOIZED IT WON'T HAVE ANY WORK SLOTS, IT WILL ONLY NEED TO ACCESS lastMountedParentFibers,
  // and that reference is stable.
  // THIS WAY WE ARE ABLE TO PRESERVE MEMOIZATION AND IMPROVE PERFORMANCE
  const children = useMemoMap(
    slots,
    (oldSlot, newSlot, index) => {
      // If The component is not unmounted / the component has been mounted at least one time => has diff to check.
      if (slotsStates[index].lastMountedContainerFiber !== null) {
        // If the component is mounted it has all the children of oldSlice? TODO: check this
        diffs[index] = loadDiff(oldSlot, newSlot);
      }
      // INDEX ARE VALID AS KEY SINCE WE DISTINGUISH PARENT BY THEIR POSITION
      // WE RELY ON MEMOIZATION TO OPTIMIZE THE WORK SLOT CREATION
      return (
        <Parent
          hostConfig={hostConfig}
          slotsStates={slotsStates}
          index={index}
          key={index}>
          {newSlot}
        </Parent>
      );
    },
    // FIXME: Meeeeehh
    [hostConfig]
  );

  // don't touch indexes with diffs[index] === null
  // state from index = diffs.length are to detach only
  detachChildrenFiberToReparent(slotsStates, diffs);

  return children;
}

export function hasSingleChild(slots: OwnerSlot[]) {
  return false;
}

export function hasElementWithNokey(slots: OwnerSlot[]) {
  return false;
}

export function existsDuplicateKey(slots: OwnerSlot[]) {
  return false;
}

export function loadDiff(oldSlot: OwnerSlot, newSlot: OwnerSlot) {}
