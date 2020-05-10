import React, {createRef} from 'react';
import type {Fiber} from 'react-reconciler';
import {mount} from 'enzyme';
import {
  getFiberFromElementInstance,
  findChildFiberAt,
  findChildFiber,
  findPreviousFiber,
  findSiblingFiber,
} from '../../src';

// Refs.
const parentElementRef = createRef<HTMLDivElement>();
const childElementRef = createRef<HTMLDivElement>();
// Fibers.
let parent: Fiber;
let child: Fiber;

beforeEach(() => {
  // Mount the component.
  mount(
    <div ref={parentElementRef}>
      <div key="1" ref={childElementRef} />
      <div key="2" />
    </div>
  );

  // Load the fibers.
  parent = getFiberFromElementInstance(parentElementRef.current);
  child = getFiberFromElementInstance(childElementRef.current);
});

describe('How findChildFiberAt( ) works', () => {
  test('Find the first child', () => {
    child = findChildFiberAt(parent, 0);
    // The child is found.
    expect(child).not.toBe(null);
    // The key is correct.
    expect(child.key).toBe('1');
  });

  test('Find the second child', () => {
    child = findChildFiberAt(parent, 1);
    // The child is found.
    expect(child).not.toBe(null);
    // The key is correct.
    expect(child.key).toBe('2');
  });

  test('Find the last child', () => {
    child = findChildFiberAt(parent, -1);
    // The child is found.
    expect(child).not.toBe(null);
    // The key is correct.
    expect(child.key).toBe('2');
  });

  test('(Provide a position bigger than the number of children) Find the last child', () => {
    child = findChildFiberAt(parent, 5);
    // The child is found.
    expect(child).not.toBe(null);
    // The key is correct.
    expect(child.key).toBe('2');
  });

  test('(Parent without children) Not find the child and get null', () => {
    parent.child = null;
    child = findChildFiberAt(parent, 1);
    // The child is not found.
    expect(child).toBe(null);
  });
});

describe('How findChildFiber( ) works', () => {
  test('Find the child with key "1"', () => {
    child = findChildFiber(parent, '1');
    // The child is found.
    expect(child).not.toBe(null);
    // The key is correct.
    expect(child.key).toBe('1');
  });

  test('Find the child with key "2"', () => {
    child = findChildFiber(parent, '2');
    // The child is found.
    expect(child).not.toBe(null);
    // The key is correct.
    expect(child.key).toBe('2');
  });

  test('(Parent without children) Not find the child and get null', () => {
    parent.child = null;
    child = findChildFiber(parent, '1');
    // The child is not found.
    expect(child).toBe(null);
  });
});

describe('How findPreviousFiber( ) works', () => {
  test('Find the child previous the one with key "2"', () => {
    child = findPreviousFiber(parent, '2');
    // The child is found.
    expect(child).not.toBe(null);
    // The key is correct.
    expect(child.key).toBe('1');
  });

  test('Find the child previous the first child and get the parent', () => {
    child = findPreviousFiber(parent, '1');
    // The child is found.
    expect(child).toBe(parent);
  });

  test('(Provide a not valid key) Not find the child and get null', () => {
    child = findPreviousFiber(parent, '3');
    // The child is not found.
    expect(child).toBe(null);
  });

  test('(Parent without children) Not find the child and get null', () => {
    parent.child = null;
    child = findPreviousFiber(parent, '1');
    // The child is not found.
    expect(child).toBe(null);
  });
});

describe('How findSiblingFiber( ) works', () => {
  test('Find the child previous the one with key "2"', () => {
    const sibling = findSiblingFiber(child, '2');
    // The child is found.
    expect(sibling).not.toBe(null);
    // The key is correct.
    expect(sibling.key).toBe('2');
  });

  test('(Provide a not valid key) Not find the child and get null', () => {
    const sibling = findSiblingFiber(child, '5');
    // The child is not found.
    expect(sibling).toBe(null);
  });

  test('(Fiber without siblings) Not find the child and get null', () => {
    child.sibling = null;
    const sibling = findSiblingFiber(child, '5');
    // The child is not found.
    expect(sibling).toBe(null);
  });
});
