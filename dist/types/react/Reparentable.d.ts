import type { ReactElement } from 'react';
import type { Fiber } from 'react-reconciler';
import { ParentFiber } from './parentFiber';
/**
 * Create a reparentable Space. Only <Reparentables>s belonging to the same
 * Space can send children to each other.
 */
export declare function createReparentableSpace(): ReparentableSpace;
export interface ReparentableProps {
    /** The reparentable id. */
    id: string;
    /** The children. */
    children: ReactElement[] | ReactElement | null;
    /** Find fiber. */
    findFiber?: (fiber: Fiber) => Fiber;
}
export interface ReparentableSpace {
    ReparentableMap: Map<string, ParentFiber>;
    Reparentable: ({ id, children, findFiber }: ReparentableProps) => JSX.Element;
    sendReparentableChild: (fromParentId: string, toParentId: string, childSelector: string | number, position: string | number, skipUpdate?: boolean | undefined) => number;
}
