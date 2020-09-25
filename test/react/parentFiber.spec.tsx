import React, {createRef} from 'react';
import {mount} from 'enzyme';
import {Child, getFibersIndices, getFibersKeys, Parent} from '../__shared__';
import {ParentFiber} from '../../src';
import {invariant, Invariant} from '../../src/invariant';

// Refs.
const parentFiberARef = createRef<ParentFiber>();
const parentFiberBRef = createRef<ParentFiber>();
// Parent fibers.
let parentA: ParentFiber;
let parentB: ParentFiber;

beforeEach(() => {
  // Mount the components.
  mount(
    <Parent parentFiberRef={parentFiberARef}>
      <Child key="1" />
      <Child key="2" />
    </Parent>
  );
  mount(
    <Parent parentFiberRef={parentFiberBRef}>
      <Child key="3" />
      <Child key="4" />
    </Parent>
  );

  // Parents.
  invariant(
    parentFiberARef.current !== null && parentFiberBRef.current !== null
  );
  parentA = parentFiberARef.current;
  parentB = parentFiberBRef.current;
});

describe('How the ParentFiber works', () => {
  test('Send a child', () => {
    const position = parentA.sendChild(parentB, '1', 0);
    // The position is correct.
    expect(position).toBe(0);
    // The indices are updated.
    expect(getFibersIndices(parentA.getCurrent())).toEqual([0]);
    expect(getFibersIndices(parentB.getCurrent())).toEqual([0, 1, 2]);
    // The keys are in the correct order.
    expect(getFibersKeys(parentA.getCurrent())).toEqual(['2']);
    expect(getFibersKeys(parentB.getCurrent())).toEqual(['1', '3', '4']);
  });

  test('(Invalid child) Not send a child', () => {
    const position = parentA.sendChild(parentB, '5', 0);
    // The position is correct.
    expect(position).toBe(-1);
    // The indices are updated.
    expect(getFibersIndices(parentA.getCurrent())).toEqual([0, 1]);
    expect(getFibersIndices(parentB.getCurrent())).toEqual([0, 1]);
    // The keys are in the correct order.
    expect(getFibersKeys(parentA.getCurrent())).toEqual(['1', '2']);
    expect(getFibersKeys(parentB.getCurrent())).toEqual(['3', '4']);
  });

  test('Add a child', () => {
    const current = parentA.getCurrent();
    // (type fixing).
    invariant(current.child !== null);
    const position = parentB.addChild(current.child, 0);
    // The position is correct.
    expect(position).toBe(0);
    // The indices are updated.
    expect(getFibersIndices(parentB.getCurrent())).toEqual([0, 1, 2]);
    // The keys are in the correct order.
    expect(getFibersKeys(parentB.getCurrent())).toEqual(['1', '3', '4']);
  });

  test('Remove a child', () => {
    const fiber = parentB.removeChild(0);
    // The fiber is found.
    expect(fiber).not.toBe(null);
    // The indices are updated.
    expect(getFibersIndices(parentB.getCurrent())).toEqual([0]);
    // The keys are in the correct order.
    expect(getFibersKeys(parentB.getCurrent())).toEqual(['4']);
  });

  test('The findFiber method', () => {
    parentA.setFinder((fiber) => {
      // (type fixing).
      invariant(fiber.child !== null);
      return fiber.child;
    });
    // The position is correct.
    expect(parentA.getCurrent().key).toBe('1');
  });

  test('Throw id the fiber is not set', () => {
    const parent = new ParentFiber();

    expect(() => {
      parent.getCurrent();
    }).toThrow(Invariant);
  });
});
