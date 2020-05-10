import type { RefObject } from 'react';
import type { Fiber } from 'react-reconciler';
import { ParentFiber } from './parentFiber';
/**
 * An hook to easily use a ParentFiber inside a function component.
 * The ref returned must reference the element that is the parent
 * of the children to reparent.
 *
 * @param findFiber - Get a different parent fiber.
 * @returns - [The ParentFiber instance, the element ref].
 */
export declare function useParent<T>(findFiber?: (fiber: Fiber) => Fiber): [ParentFiber, RefObject<T>];
