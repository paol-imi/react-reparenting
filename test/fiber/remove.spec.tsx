import React, {createRef} from 'react';
import type {Fiber} from 'react-reconciler';
import {mount} from 'enzyme';
import {Child, getFibersIndices, getFibersKeys, Parent} from '../__shared__';
import {
  removeChildFiber,
  removeChildFiberAt,
  removeFirstChildFiber,
  removeSiblingFiber,
} from '../../src';
import {invariant} from '../../src/invariant';

// Refs.
const parentRef = createRef<Fiber>();
// Fibers.
let parentFiber: Fiber;

beforeEach(() => {
  // Mount the component.
  mount(
    <Parent fiberRef={parentRef}>
      <Child key="1" />
      <Child key="2" />
    </Parent>
  );

  // (type fixing)
  invariant(parentRef.current !== null);
  parentFiber = parentRef.current;
});

describe('How removeChildFiberAt( ) works', () => {
  test('Remove the first child', () => {
    const child = removeChildFiberAt(parentFiber, 0);
    // The child is found.
    expect(child).not.toBe(null);
    // (type fixing).
    invariant(child !== null);
    // The key is correct.
    expect(child.key).toBe('1');
    // The indices are changed.
    expect(getFibersIndices(parentFiber)).toEqual([1]);
    // The keys are in the correct order.
    expect(getFibersKeys(parentFiber)).toEqual(['2']);
  });

  test('Remove the second child', () => {
    const child = removeChildFiberAt(parentFiber, 1);
    // The child is found.
    expect(child).not.toBe(null);
    // (type fixing).
    invariant(child !== null);
    // The key is correct.
    expect(child.key).toBe('2');
    // The indices are changed.
    expect(getFibersIndices(parentFiber)).toEqual([0]);
    // The keys are in the correct order.
    expect(getFibersKeys(parentFiber)).toEqual(['1']);
  });

  test('(Provide a index bigger than the number of children) Not remove the child', () => {
    const child = removeChildFiberAt(parentFiber, 5);
    // The child is not found.
    expect(child).toBe(null);
    // The indices are changed.
    expect(getFibersIndices(parentFiber)).toEqual([0, 1]);
    // The keys are in the correct order.
    expect(getFibersKeys(parentFiber)).toEqual(['1', '2']);
  });

  test('(Parent without children) Not remove the child', () => {
    // Setup.
    mount(<Parent fiberRef={parentRef} />);
    // (type fixing).
    invariant(parentRef.current !== null);
    const child = removeChildFiberAt(parentRef.current, 1);
    // The child is not found.
    expect(child).toBe(null);
  });
});

describe('How removeChildFiber( ) works', () => {
  test('Remove the child with the key "1"', () => {
    const child = removeChildFiber(parentFiber, '1');
    // The child is found.
    expect(child).not.toBe(null);
    // (type fixing).
    invariant(child !== null);
    // The key is correct.
    expect(child.key).toBe('1');
    // The indices are changed.
    expect(getFibersIndices(parentFiber)).toEqual([1]);
    // The keys are in the correct order.
    expect(getFibersKeys(parentFiber)).toEqual(['2']);
  });

  test('Remove the second child', () => {
    const child = removeChildFiber(parentFiber, '2');
    // The child is found.
    expect(child).not.toBe(null);
    // (type fixing).
    invariant(child !== null);
    // The key is correct.
    expect(child.key).toBe('2');
    // The indices are changed.
    expect(getFibersIndices(parentFiber)).toEqual([0]);
    // The keys are in the correct order.
    expect(getFibersKeys(parentFiber)).toEqual(['1']);
  });

  test('(Provide a not valid key) Not remove the child', () => {
    const child = removeChildFiber(parentFiber, '5');
    // The child is not found.
    expect(child).toBe(null);
    // The indices are changed.
    expect(getFibersIndices(parentFiber)).toEqual([0, 1]);
    // The keys are in the correct order.
    expect(getFibersKeys(parentFiber)).toEqual(['1', '2']);
  });

  test('(Parent without children) Not remove the child', () => {
    // Setup.
    mount(<Parent fiberRef={parentRef} />);
    // (type fixing).
    invariant(parentRef.current !== null);
    const child = removeChildFiber(parentRef.current, '1');
    // The child is not found.
    expect(child).toBe(null);
  });
});

describe('How removeFirstChildFiber( ) works', () => {
  test('Remove the first child', () => {
    const child = removeFirstChildFiber(parentFiber);
    // The child is found.
    expect(child).not.toBe(null);
    // (type fixing).
    invariant(child !== null);
    // The key is correct.
    expect(child.key).toBe('1');
    // The indices are changed.
    expect(getFibersIndices(parentFiber)).toEqual([1]);
    // The keys are in the correct order.
    expect(getFibersKeys(parentFiber)).toEqual(['2']);
  });

  test('(Parent without children) Not remove the child and return null', () => {
    // Setup.
    mount(<Parent fiberRef={parentRef} />);
    // (type fixing).
    invariant(parentRef.current !== null);
    const child = removeFirstChildFiber(parentRef.current);
    // The child is not found.
    expect(child).toBe(null);
  });
});

describe('How removeSiblingFiber( ) works', () => {
  test('Remove the sibling', () => {
    invariant(parentFiber.child !== null);
    const childFiber = parentFiber.child;
    const sibling = removeSiblingFiber(childFiber);
    // The sibling is found.
    expect(sibling).not.toBe(null);
    // (type fixing).
    invariant(sibling !== null);
    // The key is correct.
    expect(sibling.key).toBe('2');
    // The indices are changed.
    expect(getFibersIndices(parentFiber)).toEqual([0]);
    // The keys are in the correct order.
    expect(getFibersKeys(parentFiber)).toEqual(['1']);
  });
});
