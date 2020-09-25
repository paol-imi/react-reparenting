import React from 'react';
import {mount} from 'enzyme';
import type {Fiber} from 'react-reconciler';
import type {ReactWrapper} from 'enzyme';
import {ParentFiber, useParent} from '../../src';
import {Child} from '../__shared__';
import {invariant} from '../../src/invariant';

// Wrapper.
let wrapper: ReactWrapper;
// Parent fiber.
let parent: ParentFiber;

// Parent component.
const Parent = ({findFiber}: {findFiber?: (fiber: Fiber) => Fiber}) => {
  parent = useParent(findFiber);
  return <Child />;
};

beforeEach(() => {
  // Mount the component.
  wrapper = mount(<Parent />);
});

describe('How useParent( ) works', () => {
  test('The hook provide a ParentFiber instance', () => {
    // The ParentFiber instance is provided.
    expect(parent).toBeInstanceOf(ParentFiber);
  });

  test('The ParentFiber is initialized after mounting the component', () => {
    // The fiber is set.
    expect(parent.fiber).not.toBe(null);
  });

  test('The fiber reference is removed after unMount', () => {
    wrapper.unmount();
    // The fiber is removed.
    expect(parent.fiber).toBe(null);
  });

  test('The findFiber prop', () => {
    mount(
      <Parent
        findFiber={(fiber) => {
          // (type fixing).
          invariant(fiber.child !== null);
          return fiber.child;
        }}
      />
    );
    // The correct fiber is set.
    expect(parent.getCurrent().elementType).toBe(Child);
  });

  test('The parent is the same after a re-render', () => {
    const currentParent = parent;
    wrapper.setProps({});
    // The hook throw.
    expect(currentParent).toBe(parent);
  });
});
