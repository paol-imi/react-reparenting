import React, {createRef} from 'react';
import type {Fiber} from 'react-reconciler';
import {mount} from 'enzyme';
import {Child, getFibersIndices, getFibersKeys, Parent} from '../__shared__';
import {
  addChildFiberAt,
  addChildFiberBefore,
  addSiblingFiber,
  appendChildFiber,
  prependChildFiber,
} from '../../src';
import {invariant} from '../../src/invariant';

// Refs.
const parentRef = createRef<Fiber>();
const childRef = createRef<Fiber>();
// Fibers.
let parent: Fiber;
let child: Fiber;

beforeEach(() => {
  // Mount the components.
  mount(
    <Parent fiberRef={parentRef}>
      <Child key="1" id="1" />
      <Child key="2" id="2" />
    </Parent>
  );
  // The fragment is necessary because the fiber of the first
  // component mounted does not receive the key (maybe an Enzyme bug).
  mount(
    <>
      <Child key="3" id="3" fiberRef={childRef} />
    </>
  );

  // (type fixing).
  invariant(parentRef.current !== null && childRef.current !== null);
  parent = parentRef.current;
  child = childRef.current;
});

describe('How addChildFiberAt( ) works', () => {
  test('Add a child at the beginning', () => {
    const position = addChildFiberAt(parent, child, 0);
    // The position is correct.
    expect(position).toBe(0);
    // The parent is updated.
    expect(child.return).toBe(parent);
    // The indices are changed.
    expect(getFibersIndices(parent)).toEqual([0, 0, 1]);
    // The keys are in the correct order.
    expect(getFibersKeys(parent)).toEqual(['3', '1', '2']);
  });

  test('Add a child as the second child', () => {
    const position = addChildFiberAt(parent, child, 1);
    // The position is correct.
    expect(position).toBe(1);
    // The parent is updated.
    expect(child.return).toBe(parent);
    // The indices are changed.
    expect(getFibersIndices(parent)).toEqual([0, 0, 1]);
    // The keys are in the correct order.
    expect(getFibersKeys(parent)).toEqual(['1', '3', '2']);
  });

  test('Add a child at the bottom', () => {
    const position = addChildFiberAt(parent, child, -1);
    // The position is correct.
    expect(position).toBe(2);
    // The parent is updated.
    expect(child.return).toBe(parent);
    // The indices are changed.
    expect(getFibersIndices(parent)).toEqual([0, 1, 0]);
    // The keys are in the correct order.
    expect(getFibersKeys(parent)).toEqual(['1', '2', '3']);
  });

  test('(Provide a position bigger than the number of children) Add a child at the bottom', () => {
    const position = addChildFiberAt(parent, child, 5);
    // The position is correct.
    expect(position).toBe(2);
    // The parent is updated.
    expect(child.return).toBe(parent);
    // The indices are changed.
    expect(getFibersIndices(parent)).toEqual([0, 1, 0]);
    // The keys are in the correct order.
    expect(getFibersKeys(parent)).toEqual(['1', '2', '3']);
  });

  test('(Parent without children) Add a child at the beginning', () => {
    // Setup.
    mount(<Parent fiberRef={parentRef} />);
    // (type fixing).
    invariant(parentRef.current !== null);
    parent = parentRef.current;

    const position = addChildFiberAt(parent, child, 5);
    // The position is correct.
    expect(position).toBe(0);
    // The parent is updated.
    expect(child.return).toBe(parent);
    // The indices are changed.
    expect(getFibersIndices(parent)).toEqual([0]);
    // The keys are in the correct order.
    expect(getFibersKeys(parent)).toEqual(['3']);
  });
});

describe('How addChildFiberBefore( ) works', () => {
  test('Add a child before the one with key "2"', () => {
    const position = addChildFiberBefore(parent, child, '2');
    // The position is correct.
    expect(position).toBe(1);
    // The parent is updated.
    expect(child.return).toBe(parent);
    // The indices are changed.
    expect(getFibersIndices(parent)).toEqual([0, 0, 1]);
    // The keys are in the correct order.
    expect(getFibersKeys(parent)).toEqual(['1', '3', '2']);
  });

  test('Add a child before the first one', () => {
    const position = addChildFiberBefore(parent, child, '1');
    // The position is correct.
    expect(position).toBe(0);
    // The parent is updated.
    expect(child.return).toBe(parent);
    // The indices are changed.
    expect(getFibersIndices(parent)).toEqual([0, 0, 1]);
    // The keys are in the correct order.
    expect(getFibersKeys(parent)).toEqual(['3', '1', '2']);
  });

  test('(Provide a not valid key) Add a child as the last child', () => {
    const position = addChildFiberBefore(parent, child, '5');
    // The position is correct.
    expect(position).toBe(2);
    // The parent is updated.
    expect(child.return).toBe(parent);
    // The indices are changed.
    expect(getFibersIndices(parent)).toEqual([0, 1, 0]);
    // The keys are in the correct order.
    expect(getFibersKeys(parent)).toEqual(['1', '2', '3']);
  });
});

describe('How appendChildFiber( ) works', () => {
  test('Add a child at the bottom', () => {
    const position = appendChildFiber(parent, child);
    // The position is correct.
    expect(position).toBe(2);
    // The parent is updated.
    expect(child.return).toBe(parent);
    // The indices are changed.
    expect(getFibersIndices(parent)).toEqual([0, 1, 0]);
    // The keys are in the correct order.
    expect(getFibersKeys(parent)).toEqual(['1', '2', '3']);
  });

  test('(Parent without children) Add a child as the only child', () => {
    // Setup.
    mount(<Parent fiberRef={parentRef} />);
    // (type fixing).
    invariant(parentRef.current !== null);
    parent = parentRef.current;

    const position = appendChildFiber(parent, child);
    // The position is correct.
    expect(position).toBe(0);
    // The parent is updated.
    expect(child.return).toBe(parent);
    // The indices are changed.
    expect(getFibersIndices(parent)).toEqual([0]);
    // The keys are in the correct order.
    expect(getFibersKeys(parent)).toEqual(['3']);
  });
});

describe('How addSiblingFiber( ) works', () => {
  test('Add a child after the one with key "1"', () => {
    invariant(parent.child !== null);
    const firstChildFiber = parent.child;
    const position = addSiblingFiber(firstChildFiber, child);
    // The position is correct.
    expect(position).toBe(1);
    // The parent is updated.
    expect(child.return).toBe(parent);
    // The indices are changed.
    expect(getFibersIndices(parent)).toEqual([0, 0, 1]);
    // The keys are in the correct order.
    expect(getFibersKeys(parent)).toEqual(['1', '3', '2']);
  });
});

describe('How prependChildFiber( ) works', () => {
  test('Add a child at the beginning', () => {
    const position = prependChildFiber(parent, child);
    // The position is correct.
    expect(position).toBe(0);
    // The parent is updated.
    expect(child.return).toBe(parent);
    // The indices are changed.
    expect(getFibersIndices(parent)).toEqual([0, 0, 1]);
    // The keys are in the correct order.
    expect(getFibersKeys(parent)).toEqual(['3', '1', '2']);
  });
});
