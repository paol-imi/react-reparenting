import React, {createRef} from 'react';
import type {Fiber} from 'react-reconciler';
import {mount} from 'enzyme';
import {Child, getFibersIndices, Parent} from '../__shared__';
import {updateFibersIndex} from '../../src';
import {invariant} from '../../src/invariant';

// Refs.
const parentRef = createRef<Fiber>();
const childRef = createRef<Fiber>();
// Fibers.
let parentFiber: Fiber;
let childFiber: Fiber;

beforeEach(() => {
  // Mount the component.
  mount(
    <Parent fiberRef={parentRef}>
      <Child key="1" fiberRef={childRef} />
      <Child key="2" />
      <Child key="3" />
    </Parent>
  );

  // (type fixing).
  invariant(parentRef.current !== null && childRef.current !== null);
  parentFiber = parentRef.current;
  childFiber = childRef.current;
});

describe('How updateFibersIndex( ) works', () => {
  test('Update from the first child', () => {
    updateFibersIndex(childFiber, 5);
    // The indices are updated.
    expect(getFibersIndices(parentFiber)).toEqual([5, 6, 7]);
  });

  test('Update from the second child', () => {
    invariant(childFiber.sibling !== null);
    updateFibersIndex(childFiber.sibling, 5);
    // The indices are updated.
    expect(getFibersIndices(parentFiber)).toEqual([0, 5, 6]);
  });

  test('Update from the third child', () => {
    invariant(childFiber.sibling !== null);
    invariant(childFiber.sibling.sibling !== null);

    updateFibersIndex(childFiber.sibling.sibling, 5);
    // The indices are updated.
    expect(getFibersIndices(parentFiber)).toEqual([0, 1, 5]);
  });
});
