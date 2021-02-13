import React, {createRef} from 'react';
import type {Fiber} from 'react-reconciler';
import {mount} from 'enzyme';
import {
  findChildFiber,
  findChildFiberAt,
  findPreviousFiber,
  findSiblingFiber,
  getFiberFromElementInstance,
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

describe('How findChildFiberAt( ) works', () => {
  test('Find the first child', () => {
    const child = findChildFiberAt(parent, 0);
    // The child is found.
    expect(child).not.toBe(null);
    // (type fixing).
    invariant(child !== null);
    // The key is correct.
    expect(child.key).toBe('1');
  });

  test('Find the second child', () => {
    const child = findChildFiberAt(parent, 1);
    // The child is found.
    expect(child).not.toBe(null);
    // (type fixing).
    invariant(child !== null);
    // The key is correct.
    expect(child.key).toBe('2');
  });

  test('Find the last child', () => {
    const child = findChildFiberAt(parent, -1);
    // The child is found.
    expect(child).not.toBe(null);
    // (type fixing).
    invariant(child !== null);
    // The key is correct.
    expect(child.key).toBe('2');
  });

  test('(Provide a position bigger than the number of children) Find the last child', () => {
    const child = findChildFiberAt(parent, 5);
    // The child is found.
    expect(child).not.toBe(null);
    // (type fixing).
    invariant(child !== null);
    // The key is correct.
    expect(child.key).toBe('2');
  });

  test('(Parent without children) Not find the child and get null', () => {
    parent.child = null;
    const child = findChildFiberAt(parent, 1);
    // The child is not found.
    expect(child).toBe(null);
  });
});

describe('How findChildFiber( ) works', () => {
  test('Find the child with key "1"', () => {
    const child = findChildFiber(parent, '1');
    // The child is found.
    expect(child).not.toBe(null);
    // (type fixing).
    invariant(child !== null);
    // The key is correct.
    expect(child.key).toBe('1');
  });

  test('Find the child with key "2"', () => {
    const child = findChildFiber(parent, '2');
    // The child is found.
    expect(child).not.toBe(null);
    // (type fixing).
    invariant(child !== null);
    // The key is correct.
    expect(child.key).toBe('2');
  });

  test('(Parent without children) Not find the child and get null', () => {
    parent.child = null;
    const child = findChildFiber(parent, '1');
    // The child is not found.
    expect(child).toBe(null);
  });
});

describe('How findPreviousFiber( ) works', () => {
  test('Find the child previous the one with key "2"', () => {
    const child = findPreviousFiber(parent, '2');
    // The child is found.
    expect(child).not.toBe(null);
    // (type fixing).
    invariant(child !== null);
    // The key is correct.
    expect(child.key).toBe('1');
  });

  test('Find the child previous the first child and get the parent', () => {
    const child = findPreviousFiber(parent, '1');
    // The child is found.
    expect(child).toBe(parent);
  });

  test('(Provide a not valid key) Not find the child and get null', () => {
    const child = findPreviousFiber(parent, '3');
    // The child is not found.
    expect(child).toBe(null);
  });

  test('(Parent without children) Not find the child and get null', () => {
    parent.child = null;
    const child = findPreviousFiber(parent, '1');
    // The child is not found.
    expect(child).toBe(null);
  });
});

describe('How findSiblingFiber( ) works', () => {
  test('Find the child previous the one with key "2"', () => {
    const {child} = parent;
    // (type fixing).
    invariant(child !== null);

    const sibling = findSiblingFiber(child, '2');
    // The child is found.
    expect(sibling).not.toBe(null);
    // (type fixing).
    invariant(sibling !== null);
    // The key is correct.
    expect(sibling.key).toBe('2');
  });

  test('(Provide a not valid key) Not find the child and get null', () => {
    const {child} = parent;
    // (type fixing).
    invariant(child !== null);

    const sibling = findSiblingFiber(child, '5');
    // The child is not found.
    expect(sibling).toBe(null);
  });

  test('(Fiber without siblings) Not find the child and get null', () => {
    const {child} = parent;
    // (type fixing).
    invariant(child !== null);

    child.sibling = null;
    const sibling = findSiblingFiber(child, '5');
    // The child is not found.
    expect(sibling).toBe(null);
  });
});
