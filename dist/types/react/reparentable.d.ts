import React, { Component, ContextType } from 'react';
import type { ReactNode, MutableRefObject, RefCallback } from 'react';
import type { Fiber } from 'react-reconciler';
import { ParentFiber } from '../core/parentFiber';
/** Reparentable context. */
export declare const ReparentableContext: React.Context<ReparentableMap | null>;
/** Reparentable hook. */
export declare const useReparentable: () => ReparentableMap;
/** Reparentable map. */
export declare class ReparentableMap extends Map<string, ParentFiber> {
    set: (key: string, value: ParentFiber) => this;
    /**
     * Remove a child from a <Reparentable> component and add it to a new <Reparentable> component.
     * Return the index in which the child is added (or -1).
     * The child to remove can be chosen by providing its key (string) or by providing its index (number).
     * Return -1 if the child is not found.
     * The position can be chosen by providing a key (string) or by providing an index (number).
     * If a key (string) is provided the child will be added after the one with that key.
     * - The child is added at the bottom if none of the children have that key.
     * If an index (number) is provided the child will be added in that position.
     * - The child is added at the bottom if -1 is provided or the index is greater than the number of children.
     * If skipUpdate is not used, this method will also send the element instance.
     *
     * @param fromParentId - The id of the current parent.
     * @param toParentId - The id of the next parent.
     * @param child - The child identifier.
     * @param position - The position to send the child to.
     * @param skipUpdate - Whether to send or not the element instance.
     * @returns - The position in which the fiber is sent or -1.
     */
    send: (fromParentId: string, toParentId: string, child: string | number, position: string | number, skipUpdate?: boolean | undefined) => number;
    remove: (key: string) => boolean;
}
/** Reparentable Provider. */
export declare class ReparentableProvider extends Component<ReparentableProviderProps> {
    /** ParentFibers map. */
    map: ReparentableMap;
    componentDidMount(): void;
    render(): ReactNode;
}
/**
 * Parent component.
 *
 * It is a simple wrapper that generate internally a
 * ParentFiber and allow to access it through a React.Ref.
 * The children in which to enable reparenting must belong to this component.
 */
export declare class Reparentable extends Component<ReparentableProps> {
    /** Reparentable Context. */
    static Context: React.Context<ReparentableMap | null>;
    /** Reparentable Provider. */
    static Provider: typeof ReparentableProvider;
    /** Reparentable context type. */
    static contextType: React.Context<ReparentableMap | null>;
    /** (Typescript) context type. */
    context: ContextType<typeof ReparentableContext>;
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
export interface ReparentableProps {
    /** The reparentable id. */
    id: string;
    /** The children. */
    children?: ReactNode;
    /** Find fiber. */
    findFiber?: (fiber: Fiber) => Fiber;
}
export interface ReparentableProviderProps {
    /** The children. */
    children?: ReactNode;
    /** ReparentableMap ref. */
    reparentableMapRef?: MutableRefObject<ReparentableMap> | RefCallback<ReparentableMap>;
}
