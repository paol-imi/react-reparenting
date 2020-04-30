import React, {createRef} from 'react';
import type {Fiber} from 'react-reconciler';
import {mount} from 'enzyme';
import {getFibersIndices, warn} from '../__shared__';
import {
  getFiberFromElementInstance,
  updateFibersIndices,
  updateFiberDebugFields,
} from '../../src';

// Refs.
const parentRef = createRef<HTMLDivElement>();
// Fibers.
let parentFiber: Fiber;
let childFiber: Fiber;

beforeEach(() => {
  // Mount the component.
  mount(
    <div ref={parentRef}>
      <div key="1" />
      <div key="2" />
      <div key="3" />
    </div>
  );

  // Load the fibers.
  parentFiber = getFiberFromElementInstance(parentRef.current);
  childFiber = parentFiber.child;

  // Clear the mock.
  warn.mockClear();
});

describe('How updateFibersIndices( ) works', () => {
  test('Update from the first child fiber', () => {
    updateFibersIndices(childFiber, 5);
    // Warning calls.
    expect(warn).not.toHaveBeenCalled();
    // The indices are updated.
    expect(getFibersIndices(parentFiber)).toEqual([5, 6, 7]);
  });

  test('Update from the second child fiber', () => {
    updateFibersIndices(childFiber.sibling, 5);
    // Warning calls.
    expect(warn).not.toHaveBeenCalled();
    // The indices are updated.
    expect(getFibersIndices(parentFiber)).toEqual([0, 5, 6]);
  });

  test('Update from the third child fiber', () => {
    updateFibersIndices(childFiber.sibling.sibling, 5);
    // Warning calls.
    expect(warn).not.toHaveBeenCalled();
    // The indices are updated.
    expect(getFibersIndices(parentFiber)).toEqual([0, 1, 5]);
  });
});

describe('How updateFiberDebugFields( ) works', () => {
  test('Update from the first child fiber', () => {
    childFiber._debugOwner = null;
    childFiber._debugSource = null;

    updateFiberDebugFields(childFiber, parentFiber);
    // Warning calls.
    expect(warn).not.toHaveBeenCalled();
    // The indices are updated.
    expect(childFiber._debugOwner).toBe(childFiber.sibling._debugOwner);
    expect(childFiber._debugSource).toBe(childFiber.sibling._debugSource);
  });

  test('Update from the second child fiber', () => {
    childFiber = childFiber.sibling;
    childFiber._debugOwner = null;
    childFiber._debugSource = null;

    updateFiberDebugFields(childFiber, parentFiber);
    // Warning calls.
    expect(warn).not.toHaveBeenCalled();
    // The indices are updated.
    expect(childFiber._debugOwner).toBe(childFiber.sibling._debugOwner);
    expect(childFiber._debugSource).toBe(childFiber.sibling._debugSource);
  });
});
