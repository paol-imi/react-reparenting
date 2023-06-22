import { Component, ReactElement, useEffect } from 'react';
import { SpaceSlice } from './useOwner';
import { rollbackWork, SlotState } from './work';

export type ParentProps = {
  children: SpaceSlice;
  slotsStates: SlotState[]
};

export function Paren2t({ hostConfig, slotsStatesRef, slotsStates, index, children }: ParentProps) {
  // TODO:
  if(slotsStatesRef.current !== slotsStates) {
    // a previous render was interrupted! (the ref is shared globally, but the props depenends on the tree!)

    // If previous low-prio interruptablecontinue work, will force re-render.
    rollbackWork(slotsStatesRef.current)
  }


  const slotState = slotsStates[index];

  if (hasUncommittedChildren(slotState)) {
    rollback(slotsStates);
  } else {
    // If component ismounting
    if (owner.alternate === null) {
      appendContainer(slotState, owner)
    }
  }

  

  useEffect(() => {
    // FIXME: TRY IF CAN BE A POSSIBLE SCENARIO AND IF IT WORK ROLLBACK HERE

    if (hasUncommitedWork(workUnit)) rollbackWork(workUnit);
    mount(owner);
  }, []);
}

// WE NEED A CLASS TO ACCESS THE FIBER INSTANCE
export class Parent extends Component<ParentProps> {
  private fiber: null | Fiber = null;
  /**
   * The class instance contains the fiber data
   * only after the component is mounted.
   */
  componentDidMount() {
    const fiber = getFiberFromClassInstance(this);
    const { mount } = this.props;
    mount;
  }

  /** Update the findFiber method. */
  componentDidUpdate() {
    const fiber = getFiberFromClassInstance(this);
    const { mount } = this.props;
    mount;
  }

  /**
   * Clear on unmount.
   */
  componentWillUnmount() {
    this.parent.clear();
  }

  /**
   * Render only the children.
   * In this way the component (and therefore its fiber)
   * will be the direct parent of the children.
   */
  render() {
    const { children, oldFragmentFiber } = this.props;

    if (owner.child === null) {
      owner.child = oldOwnFiber;
      owner.alternate && owner.alternate.child = oldOwnFiber.alternate
    }

    return <>{children}</>;
  }
}
