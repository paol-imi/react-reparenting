import React, {createRef} from 'react';
import type {Fiber} from 'react-reconciler';
import {mount} from 'enzyme';
import {getFibersIndices, getFibersKeys, warn} from '../__shared__';
import {
  getFiberFromElementInstance,
  removeChildFiberAt,
  removeChildFiber,
  removeFirstChildFiber,
  removeSiblingFiber,
} from '../../src';
import {Invariant} from '../../src/invariant';

// Refs.
const parentRef = createRef<HTMLDivElement>();
// Fibers.
let parentFiber: Fiber;

beforeEach(() => {
  // Mount the component.
  mount(
    <div ref={parentRef}>
      <div key="1" />
      <div key="2" />
    </div>
  );

  // Load the fiber.
  parentFiber = getFiberFromElementInstance(parentRef.current);

  // Clear the mock.
  warn.mockClear();
});

describe('How removeChildFiberAt( ) works', () => {
  test('Remove the first child fiber', () => {
    const fiber = removeChildFiberAt(parentFiber, 0);
    // The fiber is found.
    expect(fiber).not.toBe(null);
    // The key is correct.
    expect(fiber.key).toBe('1');
    // Warning calls.
    expect(warn).not.toHaveBeenCalled();
    // The indices are changed.
    expect(getFibersIndices(parentFiber)).toEqual([1]);
    // The keys are in the correct order.
    expect(getFibersKeys(parentFiber)).toEqual(['2']);
  });

  test('Remove the second child fiber', () => {
    const fiber = removeChildFiberAt(parentFiber, 1);
    // The fiber is found.
    expect(fiber).not.toBe(null);
    // The key is correct.
    expect(fiber.key).toBe('2');
    // Warning calls.
    expect(warn).not.toHaveBeenCalled();
    // The indices are changed.
    expect(getFibersIndices(parentFiber)).toEqual([0]);
    // The keys are in the correct order.
    expect(getFibersKeys(parentFiber)).toEqual(['1']);
  });

  test('(Provide a position bigger than the number of children) Not remove the child fiber and get null', () => {
    const fiber = removeChildFiberAt(parentFiber, 5);
    // The fiber is not found.
    expect(fiber).toBe(null);
    // Warning calls.
    expect(warn).toHaveBeenCalled();
    // The indices are changed.
    expect(getFibersIndices(parentFiber)).toEqual([0, 1]);
    // The keys are in the correct order.
    expect(getFibersKeys(parentFiber)).toEqual(['1', '2']);
  });

  test('(Parent without children) Not remove the child fiber and get null', () => {
    // Setup.
    mount(<div ref={parentRef} />);
    parentFiber = getFiberFromElementInstance(parentRef.current);

    const fiber = removeChildFiberAt(parentFiber, 1);
    // The fiber is not found.
    expect(fiber).toBe(null);
    // Warning calls.
    expect(warn).toHaveBeenCalled();
  });

  test('(Provide an index < 0) Throw an error', () => {
    expect(() => {
      removeChildFiberAt(parentFiber, -1);
    }).toThrow(Invariant);
    // Warning calls.
    expect(warn).not.toHaveBeenCalled();
  });
});

describe('How removeChildFiber( ) works', () => {
  test('Remove the child fiber with the key "1"', () => {
    const fiber = removeChildFiber(parentFiber, '1');
    // The fiber is found.
    expect(fiber).not.toBe(null);
    // The key is correct.
    expect(fiber.key).toBe('1');
    // Warning calls.
    expect(warn).not.toHaveBeenCalled();
    // The indices are changed.
    expect(getFibersIndices(parentFiber)).toEqual([1]);
    // The keys are in the correct order.
    expect(getFibersKeys(parentFiber)).toEqual(['2']);
  });

  test('Remove the second child fiber', () => {
    const fiber = removeChildFiber(parentFiber, '2');
    // The fiber is found.
    expect(fiber).not.toBe(null);
    // The key is correct.
    expect(fiber.key).toBe('2');
    // Warning calls.
    expect(warn).not.toHaveBeenCalled();
    // The indices are changed.
    expect(getFibersIndices(parentFiber)).toEqual([0]);
    // The keys are in the correct order.
    expect(getFibersKeys(parentFiber)).toEqual(['1']);
  });

  test('(Provide a not valid key) Not remove the child fiber and get null', () => {
    const fiber = removeChildFiber(parentFiber, '5');
    // The fiber is not found.
    expect(fiber).toBe(null);
    // Warning calls.
    expect(warn).toHaveBeenCalled();
    // The indices are changed.
    expect(getFibersIndices(parentFiber)).toEqual([0, 1]);
    // The keys are in the correct order.
    expect(getFibersKeys(parentFiber)).toEqual(['1', '2']);
  });

  test('(Parent without children) Not remove the child fiber and get null', () => {
    // Setup.
    mount(<div ref={parentRef} />);
    parentFiber = getFiberFromElementInstance(parentRef.current);

    const fiber = removeChildFiber(parentFiber, '1');
    // The fiber is not found.
    expect(fiber).toBe(null);
    // Warning calls.
    expect(warn).toHaveBeenCalled();
  });
});

describe('How removeFirstChildFiber( ) works', () => {
  test('Remove the first child fiber', () => {
    const fiber = removeFirstChildFiber(parentFiber);
    // The fiber is found.
    expect(fiber).not.toBe(null);
    // The key is correct.
    expect(fiber.key).toBe('1');
    // Warning calls.
    expect(warn).not.toHaveBeenCalled();
    // The indices are changed.
    expect(getFibersIndices(parentFiber)).toEqual([1]);
    // The keys are in the correct order.
    expect(getFibersKeys(parentFiber)).toEqual(['2']);
  });

  test('(Parent without children) Not remove the child fiber and return null', () => {
    // Setup.
    mount(<div ref={parentRef} />);
    parentFiber = getFiberFromElementInstance(parentRef.current);

    const fiber = removeFirstChildFiber(parentFiber);
    // The fiber is not found.
    expect(fiber).toBe(null);
    // Warning calls.
    expect(warn).toHaveBeenCalled();
  });
});

describe('How removeSiblingFiber( ) works', () => {
  test('Remove the sibling fiber', () => {
    const childFiber = parentFiber.child;
    const fiber = removeSiblingFiber(childFiber);
    // The fiber is found.
    expect(fiber).not.toBe(null);
    // The key is correct.
    expect(fiber.key).toBe('2');
    // Warning calls.
    expect(warn).not.toHaveBeenCalled();
    // The indices are changed.
    expect(getFibersIndices(parentFiber)).toEqual([0]);
    // The keys are in the correct order.
    expect(getFibersKeys(parentFiber)).toEqual(['1']);
  });
});
