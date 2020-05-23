import React, {
  Component,
  createRef,
  MutableRefObject,
  RefCallback,
} from 'react';
import {mount} from 'enzyme';
import {
  getCurrentFiber,
  getFiberFromClassInstance,
  getFiberFromElementInstance,
} from '../../src';
import {Invariant} from '../../src/invariant';

// Custom class component.
class ClassComponent extends Component<{
  instanceRef: RefCallback<ClassComponent> | MutableRefObject<ClassComponent>;
}> {
  constructor(props) {
    super(props);
    const {instanceRef} = this.props;
    if (typeof instanceRef === 'function') instanceRef(this);
    if (typeof instanceRef === 'object') instanceRef.current = this;
  }

  render(): null {
    return null;
  }
}

describe('How getCurrentFiber( ) works', () => {
  test('The current fiber is the same as the one provided', () => {
    // Setup.
    const parentRef = createRef<HTMLDivElement>();
    mount(<div ref={parentRef} />);
    const parentFiber = getFiberFromElementInstance(parentRef.current);

    // The current fiber.
    const fiber = getCurrentFiber(parentFiber);
    expect(fiber).toBe(parentFiber);
  });

  test('(Re-render the component) The current fiber is the alternate of the one provided', () => {
    // Setup.
    const parentRef = createRef<HTMLDivElement>();
    mount(<div ref={parentRef} />).setProps({});
    const parentFiber = getFiberFromElementInstance(parentRef.current);

    // The current fiber.
    const fiber = getCurrentFiber(parentFiber);
    expect(fiber).toBe(parentFiber.alternate);
  });

  test('(Re-render the component 2 times) The current fiber is the same as the one provided', () => {
    // Setup.
    const parentRef = createRef<HTMLDivElement>();
    mount(<div ref={parentRef} />)
      .setProps({})
      .setProps({});
    const parentFiber = getFiberFromElementInstance(parentRef.current);

    // The current fiber.
    const fiber = getCurrentFiber(parentFiber);
    expect(fiber).toBe(parentFiber);
  });
});

describe('How getFiberFromElementInstance( ) works', () => {
  test('Find the fiber from a DOM element', () => {
    // Setup.
    const parentRef = createRef<HTMLDivElement>();
    mount(
      <>
        <div key="1" ref={parentRef} />
      </>
    );

    const fiber = getFiberFromElementInstance(parentRef.current);
    // The fiber is found.
    expect(fiber).not.toBe(null);
    // The key is correct.
    expect(fiber.key).toBe('1');
  });
});

describe('How getFiberFromClassInstance( ) works', () => {
  test('Find the fiber from a class instance', () => {
    // Setup.
    const instanceRef = createRef<ClassComponent>();
    mount(
      <>
        <ClassComponent key="1" instanceRef={instanceRef} />
      </>
    );

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
          instanceRef={(instance): void => {
            expect(() => {
              getFiberFromClassInstance(instance);
            }).toThrow(Invariant);
          }}
        />
      </>
    );
  });
});
