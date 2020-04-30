import React, {Component, createContext, useContext} from 'react';
import type {Ref, ReactNode, ReactElement, ContextType} from 'react';
import type {Fiber} from 'react-reconciler'; // eslint-disable-line
import {ParentFiber} from '../core/parentFiber';
import {getFiberFromClassInstance} from '../fiber/get';
import {invariant} from '../invariant';
import {warning} from '../warning';

/** Reparentable context. */
export const ReparentableContext = createContext<ReparentableMap | null>(null);
ReparentableContext.displayName = 'Reparentable';

/** Reparentable map. */
export class ReparentableMap extends Map<string, ParentFiber> {
  set = (key: string, value: ParentFiber): this => {
    if (__DEV__) {
      if (this.has(key)) {
        warning(
          `It seems that a new <Reparentable> has been mounted with the id: '${key}', while there is another <Reparentable> with that id`
        );
      }
    }

    return super.set(key, value);
  };

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
  send = (
    fromParentId: string,
    toParentId: string,
    child: string | number,
    position: string | number,
    skipUpdate?: boolean
  ): number => {
    const fromParent = this.get(fromParentId);
    const toParent = this.get(toParentId);

    if (__DEV__) {
      if (fromParent === undefined) {
        warning(`Cannot find a <Reparentable> with the id: '${fromParentId}'`);
      }
      if (toParent === undefined) {
        warning(`Cannot find a <Reparentable> with the id: '${toParentId}'`);
      }
    }

    // Parent ids not valid.
    if (fromParent === undefined || toParent === undefined) {
      return -1;
    }

    // Send the child.
    return fromParent.send(child, toParent, position, skipUpdate);
  };

  remove = (key: string): boolean => {
    return this.delete(key);
  };
}

/** Reparentable Provider. */
export class ReparentableProvider extends Component<ReparentableProviderProps> {
  /** ParentFibers map. */
  map = new ReparentableMap();

  componentDidMount(): void {
    const {reparentableMapRef} = this.props;

    // Set the ref.
    if (typeof reparentableMapRef === 'function') {
      reparentableMapRef(this.map);
    }
    if (typeof reparentableMapRef === 'object' && reparentableMapRef !== null) {
      // TODO: Not so pretty solution,
      // when I will have time I'll try and implement the interface MutableRefObject.
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      reparentableMapRef.current = this.map;
    }
  }

  render(): ReactNode {
    const {children} = this.props;
    return (
      <ReparentableContext.Provider value={this.map}>
        {children}
      </ReparentableContext.Provider>
    );
  }
}

/**
 * Parent component.
 *
 * It is a simple wrapper that generate internally a
 * ParentFiber and allow to access it through a global provided map.
 * The children in which to enable reparenting must belong to this component.
 */
export class Reparentable extends Component<ReparentableProps> {
  /** Reparentable Context. */
  static Context = ReparentableContext;
  /** Reparentable Provider. */
  static Provider = ReparentableProvider;
  /** Reparentable context type. */
  static contextType = ReparentableContext;
  /** (Typescript) context type. */
  context: ContextType<typeof ReparentableContext> = null;
  /** The ParentFiber instance. */
  parent: ParentFiber = new ParentFiber();

  /**
   * The class instance contains the fiber data
   * only after the component did mount.
   */
  componentDidMount(): void {
    invariant(
      this.context !== null,
      'It looks like you have not used a <Reparentable.Provider> in the top of your app'
    );

    const {set} = this.context;
    const {id, findFiber} = this.props;
    const fiber = getFiberFromClassInstance(this);

    // Ensure the id is a string.
    invariant(
      typeof id === 'string',
      'You must provide an id to the <Reparentable> component'
    );

    // Set the fiber.
    if (typeof findFiber === 'function') {
      this.parent.set(findFiber(fiber));
    } else {
      this.parent.set(fiber);
    }

    // Set the ParentFiber instance in context map.
    set(id, this.parent);
  }

  /**
   * Clear on unmount.
   */
  componentWillUnmount(): void {
    invariant(
      this.context !== null,
      'It looks like you have not used a <Reparentable.Provider> in the top of your app'
    );

    const {remove} = this.context;
    const {id} = this.props;

    // Remove the ParentFiber instance from the context map.
    remove(id);
    // Clear the ParentFiber instance.
    this.parent.clear();
  }

  /**
   * Render only the children.
   * In this way the component (and therefore its fiber)
   * will be the direct parent of the children.
   */
  render(): ReparentableProps['children'] {
    const {children} = this.props;
    return children;
  }
}

/** Reparentable hook. */
export const useReparentable = function (): ReparentableMap {
  const context = useContext(ReparentableContext);

  invariant(
    context !== null,
    'It looks like you have not used a <Reparentable.Provider> in the top of your app'
  );

  return context;
};

/* Reparentable props. */
export interface ReparentableProps {
  /** The reparentable id. */
  id: string;
  /** The children. */
  children?: ReactElement[] | ReactElement | null;
  /** Find fiber. */
  findFiber?: (fiber: Fiber) => Fiber;
}

/* Reparentable Provider props. */
export interface ReparentableProviderProps {
  /** The children. */
  children: ReactNode;
  /** ReparentableMap ref. */
  reparentableMapRef?: Ref<ReparentableMap>;
}
