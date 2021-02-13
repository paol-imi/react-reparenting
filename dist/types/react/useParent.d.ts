import type { RefObject } from 'react';
import type { Fiber } from 'react-reconciler';
import { ParentFiber } from './parentFiber';
/**
 * An hook to get a ParentFiber instance in a function component.
 * The ref returned must reference the element that is the parent
 * of the children to reparent (it is possible to get around this by
 * providing a findFiber method).
 *
 * @param findFiber - Get a different parent fiber.
 * @returns - The ParentFiber instance.
 */
export declare function useParent<T extends Node>(ref: RefObject<T>, findFiber?: (fiber: Fiber) => Fiber): ParentFiber;
