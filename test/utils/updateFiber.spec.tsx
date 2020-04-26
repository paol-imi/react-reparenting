import React, {createRef} from 'react';
import type {Fiber} from 'react-reconciler'; // eslint-disable-line
import {mount} from 'enzyme';
import {getFibersIndices, warn} from '../__shared__';
import {getFiberFromElementInstance, updateFibersIndices} from '../../src';

// Refs.
const parentRef = createRef<HTMLDivElement>();
// Fibers.
let parentFiber: Fiber;

// Mount the component before each test.
beforeEach(() => {
  // Mount the component.
  mount(
    <div ref={parentRef}>
      <div key="1" />
      <div key="2" />
      <div key="3" />
    </div>
  );

  // Load the fiber.
  parentFiber = getFiberFromElementInstance(parentRef.current);

  // Clear the mock.
  warn.mockClear();
});

describe('How updateFibersIndices( ) works', () => {
  test('Remove the first child fiber', () => {
    const childFiber = parentFiber.child;

    updateFibersIndices(childFiber, 0);
    // Warning calls.
    expect(warn).not.toHaveBeenCalled();
    // The indices are updated.
    expect(getFibersIndices(parentFiber)).toEqual([0, 1, 2]);
  });
});
