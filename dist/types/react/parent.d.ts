import { Component } from 'react';
import type { ReactNode, MutableRefObject, RefCallback } from 'react';
import type { Fiber } from 'react-reconciler';
import { ParentFiber } from '../core/parentFiber';
/**
 * Parent component.
 *
 * It is a simple wrapper that generate internally a
 * ParentFiber and allow to access it through a React.Ref.
 * The children in which to enable reparenting must belong to this component.
 */
export declare class Parent extends Component<ParentProps> {
    /** The ParentFiber instance. */
    parent: ParentFiber;
    /**
     * The class instance contains the fiber data
     * only after the component did mount.
     */
    componentDidMount(): void;
    /**
     * Clear on unmount.
     */
    componentWillUnmount(): void;
    /**
     * Render only the children.
     * In this way the component (and therefore its fiber)
     * will be the direct parent of the children.
     */
    render(): ReactNode;
}
export interface ParentProps {
    /** The children. */
    children?: ReactNode;
    /** The ref to the parentFiber. */
    parentRef: MutableRefObject<ParentFiber> | RefCallback<ParentFiber>;
    /** Find fiber. */
    findFiber?: (fiber: Fiber) => Fiber;
}
