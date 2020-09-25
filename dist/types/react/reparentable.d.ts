import type { ReactElement } from 'react';
import type { Fiber } from 'react-reconciler';
import { ParentFiber } from './parentFiber';
/**
 * Create a reparentable Space. Only <Reparentables>s belonging to the same
 * Space can send children to each other.
 */
export declare function createReparentableSpace(): {
    Reparentable: ({ id, children, findFiber }: ReparentableProps) => any;
    sendReparentableChild: (fromParentId: string, toParentId: string, childSelector: string | number, position: string | number, skipUpdate?: boolean | undefined) => number;
    ReparentableMap: Map<string, ParentFiber>;
};
export interface ReparentableProps {
    /** The reparentable id. */
    id: string;
    /** The children. */
    children: ReactElement[] | ReactElement | null;
    /** Find fiber. */
    findFiber?: (fiber: Fiber) => Fiber;
}
