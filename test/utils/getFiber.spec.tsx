import React, {
  Component,
  createRef,
  MutableRefObject,
  RefCallback,
} from 'react';
import {mount} from 'enzyme';
import {warn} from '../__shared__';
import {
  getFiberFromElementInstance,
  getCurrentFiber,
  getFiberFromClassInstance,
} from '../../src';

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

beforeEach(() => {
  // Clear the mock.
  warn.mockClear();
});

describe('How getCurrentFiber( ) works', () => {
  test('The current fiber is the given fiber or its alternate', () => {
    // Setup.
    const parentRef = createRef<HTMLDivElement>();
    mount(<div ref={parentRef} />);
    const parentFiber = getFiberFromElementInstance(parentRef.current);

    // The current fiber.
    const fiber = getCurrentFiber(parentFiber);
    expect(
      fiber === parentFiber || fiber === parentFiber.alternate
    ).toBeTruthy();
    // Warning calls.
    expect(warn).not.toHaveBeenCalled();
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
    // Warning calls.
    expect(warn).not.toHaveBeenCalled();
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
    // Warning calls.
    expect(warn).not.toHaveBeenCalled();
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
            }).toThrow();
          }}
        />
      </>
    );
    // Warning calls.
    expect(warn).not.toHaveBeenCalled();
  });
});
