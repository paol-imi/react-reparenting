import {Component} from 'react';
import type {ReactNode, Ref} from 'react';
import type {Fiber} from 'react-reconciler'; // eslint-disable-line
import {ParentFiber} from '../core/parentFiber';
import {getFiberFromClassInstance} from '../fiber/get';
import {invariant} from '../invariant';

/**
 * Parent component.
 *
 * It is a simple wrapper that generate internally a
 * ParentFiber and allow to access it through a React.Ref.
 * The children in which to enable reparenting must belong to this component.
 */
export class Parent extends Component<ParentProps> {
  /** The ParentFiber instance. */
  parent: ParentFiber = new ParentFiber();

  /**
   * The class instance contains the fiber data
   * only after the component did mount.
   */
  componentDidMount(): void {
    const {parentRef, findFiber} = this.props;
    const fiber = getFiberFromClassInstance(this);

    // Ensure a ref is passed.
    invariant(
      parentRef !== null &&
        (typeof parentRef === 'function' || typeof parentRef === 'object'),
      'You must provide a parentRef to the <Parent> component'
    );

    // Set the fiber.
    if (typeof findFiber === 'function') {
      this.parent.set(findFiber(fiber));
    } else {
      this.parent.set(fiber);
    }

    // Set the ref.
    if (typeof parentRef === 'function') {
      parentRef(this.parent);
    }
    if (typeof parentRef === 'object' && parentRef !== null) {
      // TODO: Not so pretty solution,
      // when I will have time I'll try and implement the interface MutableRefObject.
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      parentRef.current = this.parent;
    }
  }

  /**
   * Clear on unmount.
   */
  componentWillUnmount(): void {
    this.parent.clear();
  }

  /**
   * Render only the children.
   * In this way the component (and therefore its fiber)
   * will be the direct parent of the children.
   */
  render(): ReactNode {
    const {children} = this.props;
    return children;
  }
}

/* Parent props. */
export interface ParentProps {
  /** The children. */
  children: ReactNode;
  /** The ref to the parentFiber. */
  parentRef: Ref<ParentFiber>;
  /** Find fiber. */
  findFiber?: (fiber: Fiber) => Fiber;
}
