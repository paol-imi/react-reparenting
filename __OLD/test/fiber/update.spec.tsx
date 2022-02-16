import React, {createRef} from 'react';
import type {Fiber} from 'react-reconciler';
import {mount} from 'enzyme';
import {getFibersIndices} from '../__shared__';
import {
  updateFiberDebugFields,
  updateFibersIndex,
  getFiberFromElementInstance,
} from '../../src';
import {invariant} from '../../src/invariant';

// Refs.
const parentRef = createRef<HTMLDivElement>();
const childRef = createRef<HTMLDivElement>();
// Fibers.
let parent: Fiber;
let child: Fiber;

beforeEach(() => {
  // Mount the component.
  mount(
    <div ref={parentRef}>
      <div key="1" ref={childRef} />
      <div key="2" />
      <div key="3" />
    </div>
  );

  // (type fixing).
  invariant(parentRef.current !== null && childRef.current !== null);
  // Load the fibers.
  parent = getFiberFromElementInstance(parentRef.current);
  child = getFiberFromElementInstance(childRef.current);
});

describe('How updateFibersIndex( ) works', () => {
  test('Update from the first child', () => {
    updateFibersIndex(child, 5);
    // The indices are updated.
    expect(getFibersIndices(parent)).toEqual([5, 6, 7]);
  });

  test('Update from the second child', () => {
    invariant(child.sibling !== null);
    updateFibersIndex(child.sibling, 5);
    // The indices are updated.
    expect(getFibersIndices(parent)).toEqual([0, 5, 6]);
  });

  test('Update from the third child', () => {
    invariant(child.sibling !== null);
    invariant(child.sibling.sibling !== null);

    updateFibersIndex(child.sibling.sibling, 5);
    // The indices are updated.
    expect(getFibersIndices(parent)).toEqual([0, 1, 5]);
  });
});

describe('How updateFiberDebugFields( ) works', () => {
  test('Update the first child', () => {
    child._debugOwner = null;
    child._debugSource = null;

    updateFiberDebugFields(child, parent);
    // (type fixing).
    invariant(child.sibling !== null);
    // The indices are updated.
    expect(child._debugOwner).toBe(child.sibling._debugOwner);
    expect(child._debugSource).toBe(child.sibling._debugSource);
  });

  test('Update the second child', () => {
    // (type fixing).
    invariant(child.sibling !== null);
    child = child.sibling;
    child._debugOwner = null;
    child._debugSource = null;

    updateFiberDebugFields(child, parent);
    // (type fixing).
    invariant(child.sibling !== null);
    // The indices are updated.
    expect(child._debugOwner).toBe(child.sibling._debugOwner);
    expect(child._debugSource).toBe(child.sibling._debugSource);
  });

  test('Update an only child without siblings', () => {
    child.sibling = null;
    child._debugOwner = null;
    child._debugSource = null;

    updateFiberDebugFields(child, parent);
    // The indices are updated.
    expect(child._debugOwner).toBe(parent._debugOwner);
    expect(child._debugSource).toBe(parent._debugSource);
  });
});
