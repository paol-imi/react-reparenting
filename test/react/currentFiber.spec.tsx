import React, {createRef} from 'react';
import {mount} from 'enzyme';
import type {Fiber} from 'react-reconciler';
import {Parent} from '../__shared__';
import {getCurrentFiber, getCurrentOwner} from '../../src';
import {invariant} from '../../src/invariant';

describe('How getCurrentFiber( ) works', () => {
  test('The current fiber is the same as the one provided', () => {
    // Setup.
    const parentRef = createRef<Fiber>();
    mount(<Parent fiberRef={parentRef} />);

    // (type fixing).
    invariant(parentRef.current !== null);
    // The current fiber.
    const fiber = getCurrentFiber(parentRef.current);
    expect(fiber).toBe(parentRef.current);
  });

  test('(Re-render the component) The current fiber is the alternate of the one provided', () => {
    // Setup.
    const parentRef = createRef<Fiber>();
    mount(<Parent fiberRef={parentRef} />).setProps({});

    // (type fixing).
    invariant(parentRef.current !== null);
    // The current fiber.
    const fiber = getCurrentFiber(parentRef.current);
    expect(fiber).toBe(parentRef.current.alternate);
  });

  test('(Re-render the component 2 times) The current fiber is the same as the one provided', () => {
    // Setup.
    const parentRef = createRef<Fiber>();
    mount(<Parent fiberRef={parentRef} />)
      .setProps({})
      .setProps({});

    // (type fixing).
    invariant(parentRef.current !== null);
    // The current fiber.
    const fiber = getCurrentFiber(parentRef.current);
    expect(fiber).toBe(parentRef.current);
  });
});

describe('How getCurrentOwner( ) works', () => {
  test('The owner is null if not rendering', () => {
    expect(getCurrentOwner()).toBe(null);
  });
});
