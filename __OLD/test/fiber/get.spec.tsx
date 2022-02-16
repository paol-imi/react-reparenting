import React, {Component, createRef} from 'react';
import {mount} from 'enzyme';
import type {ReactWrapper} from 'enzyme';
import type {Fiber} from 'react-reconciler';
import {
  Env,
  getCurrentFiber,
  getFiberFromClassInstance,
  getFiberFromElementInstance,
  getFiberFromPath,
} from '../../src';
import {Invariant, invariant} from '../../src/invariant';

// Refs.
const parentRef = createRef<HTMLDivElement>();
const childRef = createRef<HTMLDivElement>();
// Fibers.
let parent: Fiber;
let child: Fiber;
// Wrapper.
let wrapper: ReactWrapper;

beforeEach(() => {
  // Mount the component.
  wrapper = mount(
    <div ref={parentRef}>
      <>
        <>
          <div key="1" ref={childRef} />
        </>
      </>
    </div>
  );

  // (type fixing).
  invariant(parentRef.current !== null && childRef.current !== null);
  // Load the fibers.
  parent = getFiberFromElementInstance(parentRef.current);
  child = getFiberFromElementInstance(childRef.current);
});

describe('How getFiberFromPath( ) works', () => {
  test('Get the first DOM node in the ancestors', () => {
    // (type fixing).
    invariant(child.return !== null);
    const fragment = child.return;

    const {stateNode} = getFiberFromPath(
      fragment,
      (fiber) => fiber.return,
      (fiber) => Env.isElement(fiber.elementType, fiber.stateNode)
    ) as any;

    // The fiber is found.
    expect(stateNode).toBe(parent.stateNode);
  });

  test('Not find the fiber', () => {
    const fiberToSearch = getFiberFromPath(
      child,
      (fiber) => fiber.return,
      () => false
    );

    // The fiber is not found.
    expect(fiberToSearch).toBe(null);
  });
});

describe('How getCurrentFiber( ) works', () => {
  test('The current fiber is the same as the one provided', () => {
    // The current fiber.
    const fiber = getCurrentFiber(parent);
    expect(fiber).toBe(parent);
  });

  test('(Re-render the component) The current fiber is the alternate of the one provided', () => {
    // Setup.
    wrapper.setProps({});

    // The current fiber.
    const fiber = getCurrentFiber(parent);
    expect(fiber).toBe(parent.alternate);
  });

  test('(Re-render the component 2 times) The current fiber is the same as the one provided', () => {
    // Setup.
    wrapper.setProps({}).setProps({});

    // The current fiber.
    const fiber = getCurrentFiber(parent);
    expect(fiber).toBe(parent);
  });
});

describe('How getFiberFromElementInstance( ) works', () => {
  test('Find the fiber from a DOM element', () => {
    // (type fixing).
    invariant(childRef.current !== null);
    const fiber = getFiberFromElementInstance(childRef.current);
    // The fiber is found.
    expect(fiber).not.toBe(null);
    // The key is correct.
    expect(fiber.key).toBe('1');
  });
});

describe('How getFiberFromClassInstance( ) works', () => {
  // Custom class component.
  class ClassComponent extends Component<{instanceRef: any}> {
    constructor(props: any) {
      super(props);
      const {instanceRef} = this.props;
      if (typeof instanceRef === 'function') instanceRef(this);
      if (typeof instanceRef === 'object') instanceRef.current = this;
    }

    render() {
      return null;
    }
  }

  test('Find the fiber from a class instance', () => {
    // Setup.
    const instanceRef = createRef<ClassComponent>();
    mount(
      <>
        <ClassComponent key="1" instanceRef={instanceRef} />
      </>
    );

    // (type fixing).
    invariant(instanceRef.current != null);
    const fiber = getFiberFromClassInstance(instanceRef.current);
    // The fiber is found.
    expect(fiber).not.toBe(null);
    // the key is correct
    expect(fiber.key).toBe('1');
  });

  test('Throw if the component is not mounted', () => {
    // Setup.
    mount(
      <>
        <ClassComponent
          key="1"
          instanceRef={(instance: any): void => {
            expect(() => {
              getFiberFromClassInstance(instance);
            }).toThrow(Invariant);
          }}
        />
      </>
    );
  });
});
