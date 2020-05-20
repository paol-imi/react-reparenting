import React, {createRef} from 'react';
import {mount} from 'enzyme';
import {getFibersKeys, getFibersIndices} from '../__shared__';
import {ParentFiber, getFiberFromElementInstance} from '../../src';
import {Invariant} from '../../src/invariant';

// Refs.
const parentAElementRef = createRef<HTMLDivElement>();
const parentBElementRef = createRef<HTMLDivElement>();
// Parent fibers.
let parentA: ParentFiber;
let parentB: ParentFiber;

beforeEach(() => {
  // Mount the components.
  mount(
    <div ref={parentAElementRef}>
      <div key="1" />
      <div key="2" />
    </div>
  );
  mount(
    <div ref={parentBElementRef}>
      <div key="3" />
      <div key="4" />
    </div>
  );

  // Parents.
  parentA = new ParentFiber();
  parentB = new ParentFiber();

  parentA.setFiber(getFiberFromElementInstance(parentAElementRef.current));
  parentB.setFiber(getFiberFromElementInstance(parentBElementRef.current));
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
    const position = parentB.addChild(parentA.getCurrent().child, 0);
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
    parentA.setFinder((fiber) => fiber.child);
    // The position is correct.
    expect(parentA.getCurrent().key).toBe('1');
  });

  test('Throw id the fiber is not set', () => {
    parentA.clear();

    expect(() => {
      parentA.getCurrent();
    }).toThrow(Invariant);
  });
});
