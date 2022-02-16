import type {ReactElement} from 'react';
import type {Fiber} from 'react-reconciler';
import React, {useEffect, useRef} from 'react';
import {Parent} from './Parent';
import {ParentFiber} from './parentFiber';
import {invariant} from '../invariant';
import {warning} from '../warning';

/**
 * Create a reparentable Space. Only <Reparentables>s belonging to the same
 * Space can send children to each other.
 */
export function createReparentableSpace(): ReparentableSpace {
  /** Reparentable map. */
  const ReparentableMap = new Map<string, ParentFiber>();

  /**
   * Remove a child from a <Reparentable> component and add it to another <Reparentable> component.
   * Return the index in which the child is added or -1 if the child is not found.
   * The child to remove can be chosen by providing its key (string) or by providing its index (number).
   * The position can be chosen by providing a key (string) or by providing an index (number).
   * If a key (string) is provided the child will be added after the one with that key.
   * The child is added at the bottom if none of the children have that key.
   * If an index (number) is provided the child will be added in that position.
   * The child is added at the bottom if -1 is provided or the index is greater than the number of children.
   * The method will also try to send the elements connected to the fibers (e.g. DOM elements),
   * to disable this function you can use the skipUpdate parameter.
   *
   * @param fromParentId  - The id of the <Reparentable> from whuch to remove the child.
   * @param toParentId    - The id of the <Reparentable> in which to add the child.
   * @param childSelector - The child selector.
   * @param position      - The position in which to add the child fiber.
   * @param skipUpdate    - Whether to send or not the elements.
   * @returns             - The position in which the child is sent or -1.
   */
  function sendReparentableChild(
    fromParentId: string,
    toParentId: string,
    childSelector: string | number,
    position: string | number,
    skipUpdate?: boolean
  ): number {
    // Get the ParetFiber instances.
    const fromParent = ReparentableMap.get(fromParentId);
    const toParent = ReparentableMap.get(toParentId);

    if (__DEV__) {
      if (fromParent === undefined) {
        warning(`Cannot find a <Reparentable> with the id: '${fromParentId}'.`);
      }
      if (toParent === undefined) {
        warning(`Cannot find a <Reparentable> with the id: '${toParentId}'.`);
      }
    }

    // Parents ids not valid.
    if (fromParent === undefined || toParent === undefined) {
      return -1;
    }

    // Send the child.
    return fromParent.sendChild(toParent, childSelector, position, skipUpdate);
  }

  /**
   * This component generate internally a ParentFiber instance
   * and allow to access it through a global provided map.
   * This component must be the parent of the children to reparent
   * (it is possible to get around this by providing a findFiber method).
   */
  function Reparentable({id, children, findFiber}: ReparentableProps) {
    const parentRef = useRef<ParentFiber>(null);

    useEffect(() => {
      // Ensure the id is a string.
      invariant(
        typeof id === 'string',
        'You must provide an id to the <Reparentable> component.'
      );

      if (__DEV__) {
        if (ReparentableMap.has(id)) {
          warning(
            `It seems that a new <Reparentable> has been mounted with the id: '${id}', ` +
              `while there is another <Reparentable> with that id.`
          );
        }
      }

      invariant(parentRef.current !== null);
      // Set the ParentFiber instance in the map.
      ReparentableMap.set(id, parentRef.current);

      return () => {
        // Remove the ParentFiber instance from the map.
        ReparentableMap.delete(id);
      };
    }, []);

    return (
      <Parent parentRef={parentRef} findFiber={findFiber}>
        {children}
      </Parent>
    );
  }

  return {Reparentable, sendReparentableChild, ReparentableMap};
}

/* Reparentable props. */
export interface ReparentableProps {
  /** The reparentable id. */
  id: string;
  /** The children. */
  children: ReactElement[] | ReactElement | null;
  /** Find fiber. */
  findFiber?: (fiber: Fiber) => Fiber;
}

/* Reparentable Space. */
export interface ReparentableSpace {
  ReparentableMap: Map<string, ParentFiber>;
  Reparentable: ({id, children, findFiber}: ReparentableProps) => JSX.Element;
  sendReparentableChild: (
    fromParentId: string,
    toParentId: string,
    childSelector: string | number,
    position: string | number,
    skipUpdate?: boolean | undefined
  ) => number;
}
