import { ReactElement, useEffect } from 'react';
import { useCurrentOwner } from './useCurrentOwner';
import { SpaceSlice } from './useOwner';

export type ParentProps = {
  children: SpaceSlice;
};

export function Parent({ workSlots, lookupChild, children }) {
  const owner = useCurrentOwner();

  // If component ismounting
  if (owner.alternate === null) {
    owner.alternate = oldOwnFiber;
  }

  useEffect(() => {
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
    const { children, oldOwnFiber } = this.props;

    if (owner.alternate === null) {
      owner.alternate = oldOwnFiber;
    }

    return children;
  }
}
