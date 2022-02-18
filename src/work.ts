export type WorkSlot =
  | { type: 'toComplete'; toMove: Fiber; into: Fiber }
  | { type: 'toCommit'; taken: Fiber; from: Fiber; atIndex: number };

// FIXME:
export type WorkSlots = WorkSlots[];

export function createWorkSlot(WorkSlots: WorkSlot[]) {}

export function beginWork(WorkSlots: WorkSlot[]) {}

export function completeWork(WorkSlots: WorkSlot[]) {}

export function commitWork(WorkSlots: WorkSlot[]) {}

export function rollbackWork(WorkSlots: WorkSlot[]) {}

export function existUncommitedWork(WorkSlots: WorkSlot[]) {
  return false;
}
