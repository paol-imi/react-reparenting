import React, {createRef} from 'react';
import type {Fiber} from 'react-reconciler';
import {mount} from 'enzyme';
import type {ReactWrapper} from 'enzyme';
import {warn} from '../__shared__';
import {Parent, ParentFiber} from '../../src';

// Ref.
const parentRef = createRef<ParentFiber>();
// Wrapper.
let wrapper: ReactWrapper;
// Parent fiber.
let parent: ParentFiber;

beforeEach(() => {
  // Mount the component.
  wrapper = mount(
    <Parent parentRef={parentRef}>
      <div key="1" />
      <div key="2" />
    </Parent>
  );

  // Parent.
  parent = parentRef.current;

  // Clear the mock.
  warn.mockClear();
});

describe('How <Parent> works', () => {
  test('The component provide a ParentFiber instance', () => {
    // The ParentFiber instance is provided.
    expect(parent).toBeInstanceOf(ParentFiber);
    // Warning calls.
    expect(warn).not.toHaveBeenCalled();
  });

  test('The ParentFiber is initialized after mounting the component', () => {
    // The fiber is set.
    expect(parent.fiber).not.toBe(null);
    // Warning calls.
    expect(warn).not.toHaveBeenCalled();
  });

  test('The fiber reference is removed after unMount', () => {
    wrapper.unmount();
    // The fiber is removed.
    expect(parent.fiber).toBe(null);
    // Warning calls.
    expect(warn).not.toHaveBeenCalled();
  });

  test('The findFiber prop', () => {
    mount(
      <Parent parentRef={parentRef} findFiber={(fiber): Fiber => fiber.child}>
        <div key="1" />
      </Parent>
    );
    // The correct fiber is set.
    expect(parentRef.current.fiber.key).toBe('1');
    // Warning calls.
    expect(warn).not.toHaveBeenCalled();
  });
});
