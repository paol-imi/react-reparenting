import type { Fiber } from 'react-reconciler';

export type SlotState =
  // The fiber may not ha been mounted yet (null),
  // But we are sure that a component will render and execute this work
  // Even if we have the last previous mounted, we will complete the work only in
  {
    lastMountedContainerFiber: Fiber | null;
    isReparentingFromParentFiber: Fiber | false;
    removedChildrenFibers: { removed: Fiber; from: Fiber; at: number }[] | null;
    childrenFibersToAdd: { toAdd: Fiber; at: number }[] | null;
    renderCount: number;
  };

export function emptyStateFactory() {
  return {
    // Last mounted fragment container fiber. This will only be changed on commit, so any discarded render won't set invalid data.
    lastMountedContainerFiber: null,
    // Since the fragment could move, we need to know th original parent to rollback in case
    isReparentingFromParentFiber: false,

    removedChildrenFibers: null,
    childrenFibersToAdd: null,

    renderCount: 0,
  };
}

export function initWorkUnits(workUnits: WorkUnit[]) {}

export function completeWork(workUnit: WorkUnit) {}

export function commitWork(workUnit: WorkUnit) {}

export function rollbackWork(workUnits: WorkUnit[]) {
  for (const containerState of state) {
    // TODO: THIS WILL BE NULLIFIED AT (CONTAINER) COMMIT TIME
    if (containerState.childrenFibersToAdd !== null) {
      remove(containerState.childrenFibersToAdd);
      containerState.childrenFibersToAdd = null;
    }

    if (containerState.isReparentingFromParentFiber !== false) {
      moveContainer(containerState.isReparentingFromParentFiber);
      containerState.isReparentingFromParentFiber = false;
    }
  }

  for (const containerState of state) {
    // TODO: THIS WILL BE NULLIFIED AT (CONTAINER) COMMIT TIME
    if (containerState.removedChildrenFibers !== null) {
      add(containerState.removedChildrenFibers);
      containerState.removedChildrenFibers = null;
    }

    containerState.renderCount = 0;
  }
}

export function hasRenderedBeforeWithoutCommit(workUnits: WorkUnit) {
  return false;
}

export function detachReparentedChildrenFibers(workUnits: WorkUnit[]) {}
