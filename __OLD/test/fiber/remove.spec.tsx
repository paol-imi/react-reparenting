import React, {createRef} from 'react';
import type {Fiber} from 'react-reconciler';
import {mount} from 'enzyme';
import {getFibersIndices, getFibersKeys} from '../__shared__';
import {
  getFiberFromElementInstance,
  removeChildFiber,
  removeChildFiberAt,
  removeFirstChildFiber,
  removeSiblingFiber,
} from '../../src';
import {invariant} from '../../src/invariant';

// Refs.
const parentRef = createRef<HTMLDivElement>();
// Fibers.
let parent: Fiber;

beforeEach(() => {
  // Mount the component.
  mount(
    <div ref={parentRef}>
      <div key="1" />
      <div key="2" />
    </div>
  );

  // (type fixing).
  invariant(parentRef.current !== null);
  // Load the fibers.
  parent = getFiberFromElementInstance(parentRef.current);
});

describe('How removeChildFiberAt( ) works', () => {
  test('Remove the first child', () => {
    const child = removeChildFiberAt(parent, 0);
    // The child is found.
    expect(child).not.toBe(null);
    // (type fixing).
    invariant(child !== null);
    // The key is correct.
    expect(child.key).toBe('1');
    // The indices are changed.
    expect(getFibersIndices(parent)).toEqual([1]);
    // The keys are in the correct order.
    expect(getFibersKeys(parent)).toEqual(['2']);
  });

  test('Remove the second child', () => {
    const child = removeChildFiberAt(parent, 1);
    // The child is found.
    expect(child).not.toBe(null);
    // (type fixing).
    invariant(child !== null);
    // The key is correct.
    expect(child.key).toBe('2');
    // The indices are changed.
    expect(getFibersIndices(parent)).toEqual([0]);
    // The keys are in the correct order.
    expect(getFibersKeys(parent)).toEqual(['1']);
  });

  test('(Provide a index bigger than the number of children) Not remove the child', () => {
    const child = removeChildFiberAt(parent, 5);
    // The child is not found.
    expect(child).toBe(null);
    // The indices are changed.
    expect(getFibersIndices(parent)).toEqual([0, 1]);
    // The keys are in the correct order.
    expect(getFibersKeys(parent)).toEqual(['1', '2']);
  });

  test('(Parent without children) Not remove the child', () => {
    // Setup.
    mount(<div ref={parentRef} />);
    // (type fixing).
    invariant(parentRef.current !== null);
    parent = getFiberFromElementInstance(parentRef.current);
    const child = removeChildFiberAt(parent, 1);
    // The child is not found.
    expect(child).toBe(null);
  });
});

describe('How removeChildFiber( ) works', () => {
  test('Remove the child with the key "1"', () => {
    const child = removeChildFiber(parent, '1');
    // The child is found.
    expect(child).not.toBe(null);
    // (type fixing).
    invariant(child !== null);
    // The key is correct.
    expect(child.key).toBe('1');
    // The indices are changed.
    expect(getFibersIndices(parent)).toEqual([1]);
    // The keys are in the correct order.
    expect(getFibersKeys(parent)).toEqual(['2']);
  });

  test('Remove the second child', () => {
    const child = removeChildFiber(parent, '2');
    // The child is found.
    expect(child).not.toBe(null);
    // (type fixing).
    invariant(child !== null);
    // The key is correct.
    expect(child.key).toBe('2');
    // The indices are changed.
    expect(getFibersIndices(parent)).toEqual([0]);
    // The keys are in the correct order.
    expect(getFibersKeys(parent)).toEqual(['1']);
  });

  test('(Provide a not valid key) Not remove the child', () => {
    const child = removeChildFiber(parent, '5');
    // The child is not found.
    expect(child).toBe(null);
    // The indices are changed.
    expect(getFibersIndices(parent)).toEqual([0, 1]);
    // The keys are in the correct order.
    expect(getFibersKeys(parent)).toEqual(['1', '2']);
  });

  test('(Parent without children) Not remove the child', () => {
    // Setup.
    mount(<div ref={parentRef} />);
    // (type fixing).
    invariant(parentRef.current !== null);
    parent = getFiberFromElementInstance(parentRef.current);
    const child = removeChildFiber(parent, '1');
    // The child is not found.
    expect(child).toBe(null);
  });
});

describe('How removeFirstChildFiber( ) works', () => {
  test('Remove the first child', () => {
    const child = removeFirstChildFiber(parent);
    // The child is found.
    expect(child).not.toBe(null);
    // (type fixing).
    invariant(child !== null);
    // The key is correct.
    expect(child.key).toBe('1');
    // The indices are changed.
    expect(getFibersIndices(parent)).toEqual([1]);
    // The keys are in the correct order.
    expect(getFibersKeys(parent)).toEqual(['2']);
  });

  test('(Parent without children) Not remove the child and return null', () => {
    // Setup.
    mount(<div ref={parentRef} />);
    // (type fixing).
    invariant(parentRef.current !== null);
    parent = getFiberFromElementInstance(parentRef.current);
    const child = removeFirstChildFiber(parent);
    // The child is not found.
    expect(child).toBe(null);
  });
});

describe('How removeSiblingFiber( ) works', () => {
  test('Remove the sibling', () => {
    invariant(parent.child !== null);
    const childFiber = parent.child;
    const sibling = removeSiblingFiber(childFiber);
    // The sibling is found.
    expect(sibling).not.toBe(null);
    // (type fixing).
    invariant(sibling !== null);
    // The key is correct.
    expect(sibling.key).toBe('2');
    // The indices are changed.
    expect(getFibersIndices(parent)).toEqual([0]);
    // The keys are in the correct order.
    expect(getFibersKeys(parent)).toEqual(['1']);
  });
});
