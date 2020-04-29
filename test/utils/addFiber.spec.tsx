import React, {createRef} from 'react';
import type {Fiber} from 'react-reconciler';
import {mount} from 'enzyme';
import {getFibersKeys, getFibersIndices, warn} from '../__shared__';
import {
  getFiberFromElementInstance,
  addChildFiberAt,
  addChildFiberBefore,
  addSiblingFiber,
  appendChildFiber,
} from '../../src';

// Refs.
const parentRef = createRef<HTMLDivElement>();
const childRef = createRef<HTMLDivElement>();
// Fibers.
let parentFiber: Fiber;
let childFiber: Fiber;

beforeEach(() => {
  // Mount the components.
  mount(
    <div>
      <div key="3" ref={childRef} />
    </div>
  );
  mount(
    <div ref={parentRef}>
      <div key="1" />
      <div key="2" />
    </div>
  );

  // Load the fibers.
  parentFiber = getFiberFromElementInstance(parentRef.current);
  childFiber = getFiberFromElementInstance(childRef.current);

  // Clear the mock.
  warn.mockClear();
});

describe('How addChildFiberAt( ) works', () => {
  test('Add a fiber as the first child', () => {
    const position = addChildFiberAt(parentFiber, childFiber, 0);
    // The position is correct.
    expect(position).toBe(0);
    // Warning calls.
    expect(warn).not.toHaveBeenCalled();
    // The parent fiber is updated.
    expect(childFiber.return).toBe(parentFiber);
    // The indices are updated.
    expect(getFibersIndices(parentFiber)).toEqual([0, 1, 2]);
    // The keys are in the correct order.
    expect(getFibersKeys(parentFiber)).toEqual(['3', '1', '2']);
  });

  test('Add a fiber as the second child', () => {
    const position = addChildFiberAt(parentFiber, childFiber, 1);
    // The position is correct.
    expect(position).toBe(1);
    // Warning calls.
    expect(warn).not.toHaveBeenCalled();
    // The parent fiber is updated.
    expect(childFiber.return).toBe(parentFiber);
    // The indices are updated.
    expect(getFibersIndices(parentFiber)).toEqual([0, 1, 2]);
    // The keys are in the correct order.
    expect(getFibersKeys(parentFiber)).toEqual(['1', '3', '2']);
  });

  test('Add a fiber as the third (last) child', () => {
    const position = addChildFiberAt(parentFiber, childFiber, 2);
    // The position is correct.
    expect(position).toBe(2);
    // Warning calls.
    expect(warn).not.toHaveBeenCalled();
    // The parent fiber is updated.
    expect(childFiber.return).toBe(parentFiber);
    // The indices are updated.
    expect(getFibersIndices(parentFiber)).toEqual([0, 1, 2]);
    // The keys are in the correct order.
    expect(getFibersKeys(parentFiber)).toEqual(['1', '2', '3']);
  });

  test('Add a fiber as the last child', () => {
    const position = addChildFiberAt(parentFiber, childFiber, -1);
    // The position is correct.
    expect(position).toBe(2);
    // Warning calls.
    expect(warn).not.toHaveBeenCalled();
    // The parent fiber is updated.
    expect(childFiber.return).toBe(parentFiber);
    // The indices are updated.
    expect(getFibersIndices(parentFiber)).toEqual([0, 1, 2]);
    // The keys are in the correct order.
    expect(getFibersKeys(parentFiber)).toEqual(['1', '2', '3']);
  });

  test('(Provide a position bigger than the number of children) Add a fiber as the last child', () => {
    const position = addChildFiberAt(parentFiber, childFiber, 5);
    // The position is correct.
    expect(position).toBe(2);
    // Warning calls.
    expect(warn).toHaveBeenCalled();
    // The parent fiber is updated.
    expect(childFiber.return).toBe(parentFiber);
    // The indices are updated.
    expect(getFibersIndices(parentFiber)).toEqual([0, 1, 2]);
    // The keys are in the correct order.
    expect(getFibersKeys(parentFiber)).toEqual(['1', '2', '3']);
  });

  test('(Parent without children) Add a fiber as the first child', () => {
    // Setup.
    mount(<div ref={parentRef} />);
    parentFiber = getFiberFromElementInstance(parentRef.current);

    const position = addChildFiberAt(parentFiber, childFiber, 0);
    // The position is correct.
    expect(position).toBe(0);
    // Warning calls.
    expect(warn).not.toHaveBeenCalled();
    // The parent fiber is updated.
    expect(childFiber.return).toBe(parentFiber);
    // The indices are updated.
    expect(getFibersIndices(parentFiber)).toEqual([0]);
    // The keys are in the correct order.
    expect(getFibersKeys(parentFiber)).toEqual(['3']);
  });

  test('(Parent without children) Add a fiber as the last child', () => {
    // Setup.
    mount(<div ref={parentRef} />);
    parentFiber = getFiberFromElementInstance(parentRef.current);

    const position = addChildFiberAt(parentFiber, childFiber, -1);
    // The position is correct.
    expect(position).toBe(0);
    // Warning calls.
    expect(warn).not.toHaveBeenCalled();
    // The parent fiber is updated.
    expect(childFiber.return).toBe(parentFiber);
    // The indices are updated.
    expect(getFibersIndices(parentFiber)).toEqual([0]);
    // The keys are in the correct order.
    expect(getFibersKeys(parentFiber)).toEqual(['3']);
  });

  test('(Parent without children) (Provide a position bigger than 0) Add a fiber as the only child', () => {
    // Setup.
    mount(<div ref={parentRef} />);
    parentFiber = getFiberFromElementInstance(parentRef.current);

    const position = addChildFiberAt(parentFiber, childFiber, 1);
    // The position is correct.
    expect(position).toBe(0);
    // Warning calls.
    expect(warn).toHaveBeenCalled();
    // The parent fiber is updated.
    expect(childFiber.return).toBe(parentFiber);
    // The indices are updated.
    expect(getFibersIndices(parentFiber)).toEqual([0]);
    // The keys are in the correct order.
    expect(getFibersKeys(parentFiber)).toEqual(['3']);
  });

  test('(Skip update) Add a fiber as the only child', () => {
    // Setup.
    mount(<div ref={parentRef} />);
    parentFiber = getFiberFromElementInstance(parentRef.current);

    childFiber.index = 1;
    const position = addChildFiberAt(parentFiber, childFiber, 0, true);
    // The position is correct.
    expect(position).toBe(0);
    // Warning calls.
    expect(warn).not.toHaveBeenCalled();
    // The parent fiber is updated.
    expect(childFiber.return).toBe(parentFiber);
    // The indices are not updated.
    expect(getFibersIndices(parentFiber)).toEqual([1]);
    // The keys are in the correct order.
    expect(getFibersKeys(parentFiber)).toEqual(['3']);
  });
});

describe('How addChildFiberBefore( ) works', () => {
  test('Add a fiber before the one with key "1"', () => {
    const position = addChildFiberBefore(parentFiber, childFiber, '1');
    // The position is correct.
    expect(position).toBe(0);
    // Warning calls.
    expect(warn).not.toHaveBeenCalled();
    // The parent fiber is updated.
    expect(childFiber.return).toBe(parentFiber);
    // The indices are updated.
    expect(getFibersIndices(parentFiber)).toEqual([0, 1, 2]);
    // The keys are in the correct order.
    expect(getFibersKeys(parentFiber)).toEqual(['3', '1', '2']);
  });

  test('Add a fiber before the one with key "2"', () => {
    const position = addChildFiberBefore(parentFiber, childFiber, '2');
    // The position is correct.
    expect(position).toBe(1);
    // Warning calls.
    expect(warn).not.toHaveBeenCalled();
    // The parent fiber is updated.
    expect(childFiber.return).toBe(parentFiber);
    // The indices are updated.
    expect(getFibersIndices(parentFiber)).toEqual([0, 1, 2]);
    // The keys are in the correct order.
    expect(getFibersKeys(parentFiber)).toEqual(['1', '3', '2']);
  });

  test('(Provide a not valid key) Add a fiber as the last child', () => {
    const position = addChildFiberBefore(parentFiber, childFiber, '5');
    // The position is correct.
    expect(position).toBe(2);
    // Warning calls.
    expect(warn).toHaveBeenCalled();
    // The parent fiber is updated.
    expect(childFiber.return).toBe(parentFiber);
    // The indices are updated.
    expect(getFibersIndices(parentFiber)).toEqual([0, 1, 2]);
    // The keys are in the correct order.
    expect(getFibersKeys(parentFiber)).toEqual(['1', '2', '3']);
  });

  test('(Parent without children) (Provide a not valid key) Add a fiber as the only child', () => {
    // Setup.
    mount(<div ref={parentRef} />);
    parentFiber = getFiberFromElementInstance(parentRef.current);

    const position = addChildFiberBefore(parentFiber, childFiber, '5');
    // The position is correct.
    expect(position).toBe(0);
    // Warning calls.
    expect(warn).toHaveBeenCalled();
    // The parent fiber is updated.
    expect(childFiber.return).toBe(parentFiber);
    // The indices are updated.
    expect(getFibersIndices(parentFiber)).toEqual([0]);
    // The keys are in the correct order.
    expect(getFibersKeys(parentFiber)).toEqual(['3']);
  });
});

describe('How appendChildFiber( ) works', () => {
  test('Add a fiber as the last child', () => {
    const position = appendChildFiber(parentFiber, childFiber);
    // The position is correct.
    expect(position).toBe(2);
    // Warning calls.
    expect(warn).not.toHaveBeenCalled();
    // The parent fiber is updated.
    expect(childFiber.return).toBe(parentFiber);
    // The indices are updated.
    expect(getFibersIndices(parentFiber)).toEqual([0, 1, 2]);
    // The keys are in the correct order.
    expect(getFibersKeys(parentFiber)).toEqual(['1', '2', '3']);
  });

  test('(Parent without children) Add a fiber as the only child', () => {
    // Setup.
    mount(<div ref={parentRef} />);
    parentFiber = getFiberFromElementInstance(parentRef.current);

    const position = appendChildFiber(parentFiber, childFiber);
    // The position is correct.
    expect(position).toBe(0);
    // Warning calls.
    expect(warn).not.toHaveBeenCalled();
    // The parent fiber is updated.
    expect(childFiber.return).toBe(parentFiber);
    // The indices are updated.
    expect(getFibersIndices(parentFiber)).toEqual([0]);
    // The keys are in the correct order.
    expect(getFibersKeys(parentFiber)).toEqual(['3']);
  });

  test('(Skip update) Add a fiber as the only child', () => {
    // Setup.
    mount(<div ref={parentRef} />);
    parentFiber = getFiberFromElementInstance(parentRef.current);

    childFiber.index = 1;
    const position = appendChildFiber(parentFiber, childFiber, true);
    // The position is correct.
    expect(position).toBe(0);
    // Warning calls.
    expect(warn).not.toHaveBeenCalled();
    // The parent fiber is updated.
    expect(childFiber.return).toBe(parentFiber);
    // The indices are not updated.
    expect(getFibersIndices(parentFiber)).toEqual([1]);
    // The keys are in the correct order.
    expect(getFibersKeys(parentFiber)).toEqual(['3']);
  });
});

describe('How addSiblingFiber( ) works', () => {
  test('Add a fiber after the one with key "1"', () => {
    const firstChildFiber = parentFiber.child;
    const position = addSiblingFiber(firstChildFiber, childFiber);
    // The position is correct.
    expect(position).toBe(1);
    // Warning calls.
    expect(warn).not.toHaveBeenCalled();
    // The parent fiber is updated.
    expect(childFiber.return).toBe(parentFiber);
    // The indices are updated.
    expect(getFibersIndices(parentFiber)).toEqual([0, 1, 2]);
    // The keys are in the correct order.
    expect(getFibersKeys(parentFiber)).toEqual(['1', '3', '2']);
  });
});
