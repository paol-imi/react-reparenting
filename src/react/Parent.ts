import type {ReactNode, Ref} from 'react';
import type {Fiber} from 'react-reconciler';
import {Component} from 'react';
import {ParentFiber} from './parentFiber';
import {getFiberFromClassInstance} from '../fiber/getFiber';
import {invariant} from '../invariant';

/**
 * It is a simple wrapper that generate internally a
 * ParentFiber and allow to access it through a React.Ref.
 * The children in which to enable reparenting must belong to this component.
 */
export class Parent extends Component<ParentProps> {
  /** The ParentFiber instance. */
  parent: ParentFiber = new ParentFiber();

  /**
   * The class instance contains the fiber data
   * only after the component is mounted.
   */
  componentDidMount(): void {
    const {parentRef, findFiber} = this.props;
    const fiber = getFiberFromClassInstance(this);

    // Ensure a ref is passed.
    invariant(
      parentRef !== null &&
        (typeof parentRef === 'function' || typeof parentRef === 'object'),
      'You must provide a parentRef to the <Parent> component.'
    );

    // Set the fiber.
    this.parent.setFiber(fiber);
    this.parent.setFinder(findFiber);

    // Set the ref.
    if (typeof parentRef === 'function') {
      parentRef(this.parent);
    }
    if (typeof parentRef === 'object' && parentRef !== null) {
      // The type of ref that is normally returned by useRef and createRef
      // is not mutable, and the user may not know how to obtain a mutable one,
      // causing annoying problems. Plus, it makes sense that this property is
      // immutable, so I just use the refObject interface (and not
      // the MutableRefObject interface) with the @ts-ignore.
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      parentRef.current = this.parent;
    }
  }

  /** Update the findFiber method. */
  componentDidUpdate(): void {
    const {findFiber} = this.props;
    this.parent.setFinder(findFiber);
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
