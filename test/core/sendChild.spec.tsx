import React, {createRef} from 'react';
import type {Fiber} from 'react-reconciler';
import {mount} from 'enzyme';
import type {ReactWrapper} from 'enzyme';
import {getFibersKeys, getFibersIndices} from '../__shared__';
import {sendChild, getFiberFromElementInstance} from '../../src';
import {warning} from '../../src/warning';

// Refs.
const parentAElementRef = createRef<HTMLDivElement>();
const parentBElementRef = createRef<HTMLDivElement>();
// Wrappers.
let wrapperA: ReactWrapper;
let wrapperB: ReactWrapper;
// Parent fibers.
let parentA: Fiber;
let parentB: Fiber;

beforeEach(() => {
  // Mount the components.
  wrapperA = mount(
    <div ref={parentAElementRef}>
      <div key="1" id="1" />
      <div key="2" id="2" />
    </div>
  );
  wrapperB = mount(
    <div ref={parentBElementRef}>
      <div key="3" id="3" />
      <div key="4" id="4" />
    </div>
  );

  // Parents.
  parentA = getFiberFromElementInstance(parentAElementRef.current);
  parentB = getFiberFromElementInstance(parentBElementRef.current);

  // Clear the mock.
  (warning as jest.Mock).mockClear();
});

describe('How sendChild( ) works', () => {
  test('Append a child', () => {
    const position = sendChild(parentA, parentB, '1', -1);
    // The position is correct.
    expect(position).toBe(2);
    // Warning calls.
    expect(warning).not.toHaveBeenCalled();
    // The indices are updated.
    expect(getFibersIndices(parentA)).toEqual([0]);
    expect(getFibersIndices(parentB)).toEqual([0, 1, 2]);
    // The keys are in the correct order.
    expect(getFibersKeys(parentA)).toEqual(['2']);
    expect(getFibersKeys(parentB)).toEqual(['3', '4', '1']);
    // The children are in the correct order.
    expect(
      Array.from(wrapperA.getDOMNode().children).map((child) =>
        child.getAttribute('id')
      )
    ).toEqual(['2']);
    expect(
      Array.from(wrapperB.getDOMNode().children).map((child) =>
        child.getAttribute('id')
      )
    ).toEqual(['3', '4', '1']);
  });

  test('Insert a child before another child', () => {
    const position = sendChild(parentA, parentB, '1', 0);
    // The position is correct.
    expect(position).toBe(0);
    // Warning calls.
    expect(warning).not.toHaveBeenCalled();
    // The indices are updated.
    expect(getFibersIndices(parentA)).toEqual([0]);
    expect(getFibersIndices(parentB)).toEqual([0, 1, 2]);
    // The keys are in the correct order.
    expect(getFibersKeys(parentA)).toEqual(['2']);
    expect(getFibersKeys(parentB)).toEqual(['1', '3', '4']);
    // The children are in the correct order.
    expect(
      Array.from(wrapperA.getDOMNode().children).map((child) =>
        child.getAttribute('id')
      )
    ).toEqual(['2']);
    expect(
      Array.from(wrapperB.getDOMNode().children).map((child) =>
        child.getAttribute('id')
      )
    ).toEqual(['1', '3', '4']);
  });

  test('(Provide a not valid child) Not send the child', () => {
    const position = sendChild(parentA, parentB, '5', 0);
    // The position is correct.
    expect(position).toBe(-1);
    // Warning calls.
    expect(warning).toHaveBeenCalledTimes(1);
    // The indices are updated.
    expect(getFibersIndices(parentA)).toEqual([0, 1]);
    expect(getFibersIndices(parentB)).toEqual([0, 1]);
    // The keys are in the correct order.
    expect(getFibersKeys(parentA)).toEqual(['1', '2']);
    expect(getFibersKeys(parentB)).toEqual(['3', '4']);
    // The children are in the correct order.
    expect(
      Array.from(wrapperA.getDOMNode().children).map((child) =>
        child.getAttribute('id')
      )
    ).toEqual(['1', '2']);
    expect(
      Array.from(wrapperB.getDOMNode().children).map((child) =>
        child.getAttribute('id')
      )
    ).toEqual(['3', '4']);
  });

  test('(Provide a not valid position) The child is added at the bottom', () => {
    const position = sendChild(parentA, parentB, '1', '5');
    // The position is correct.
    expect(position).toBe(2);
    // Warning calls.
    expect(warning).toHaveBeenCalledTimes(1);
    // The indices are updated.
    expect(getFibersIndices(parentA)).toEqual([0]);
    expect(getFibersIndices(parentB)).toEqual([0, 1, 2]);
    // The keys are in the correct order.
    expect(getFibersKeys(parentA)).toEqual(['2']);
    expect(getFibersKeys(parentB)).toEqual(['3', '4', '1']);
    // The children are in the correct order.
    expect(
      Array.from(wrapperA.getDOMNode().children).map((child) =>
        child.getAttribute('id')
      )
    ).toEqual(['2']);
    expect(
      Array.from(wrapperB.getDOMNode().children).map((child) =>
        child.getAttribute('id')
      )
    ).toEqual(['3', '4', '1']);
  });

  test('(Enable skipUpdate option) Send a child but not update the DOM', () => {
    const position = sendChild(parentA, parentB, '1', 0, true);
    // The position is correct.
    expect(position).toBe(0);
    // Warning calls.
    expect(warning).not.toHaveBeenCalled();
    // The indices are updated.
    expect(getFibersIndices(parentA)).toEqual([0]);
    expect(getFibersIndices(parentB)).toEqual([0, 1, 2]);
    // The keys are in the correct order.
    expect(getFibersKeys(parentA)).toEqual(['2']);
    expect(getFibersKeys(parentB)).toEqual(['1', '3', '4']);
    // The children are in the correct order.
    expect(
      Array.from(wrapperA.getDOMNode().children).map((child) =>
        child.getAttribute('id')
      )
    ).toEqual(['1', '2']);
    expect(
      Array.from(wrapperB.getDOMNode().children).map((child) =>
        child.getAttribute('id')
      )
    ).toEqual(['3', '4']);
  });

  test('(The child element is not found) Send a child but not update the DOM', () => {
    parentA.child.stateNode = null;

    const position = sendChild(parentA, parentB, '1', 0);
    // The position is correct.
    expect(position).toBe(0);
    // Warning calls.
    expect(warning).toHaveBeenCalledTimes(1);
    // The indices are updated.
    expect(getFibersIndices(parentA)).toEqual([0]);
    expect(getFibersIndices(parentB)).toEqual([0, 1, 2]);
    // The keys are in the correct order.
    expect(getFibersKeys(parentA)).toEqual(['2']);
    expect(getFibersKeys(parentB)).toEqual(['1', '3', '4']);
    // The children are in the correct order.
    expect(
      Array.from(wrapperA.getDOMNode().children).map((child) =>
        child.getAttribute('id')
      )
    ).toEqual(['1', '2']);
    expect(
      Array.from(wrapperB.getDOMNode().children).map((child) =>
        child.getAttribute('id')
      )
    ).toEqual(['3', '4']);
  });

  test('(The child element before is not found) Send a child but not update the DOM', () => {
    parentB.child.stateNode = null;

    const position = sendChild(parentA, parentB, '1', '3');
    // The position is correct.
    expect(position).toBe(0);
    // Warning calls.
    expect(warning).toHaveBeenCalledTimes(1);
    // The indices are updated.
    expect(getFibersIndices(parentA)).toEqual([0]);
    expect(getFibersIndices(parentB)).toEqual([0, 1, 2]);
    // The keys are in the correct order.
    expect(getFibersKeys(parentA)).toEqual(['2']);
    expect(getFibersKeys(parentB)).toEqual(['1', '3', '4']);
    // The children are in the correct order.
    expect(
      Array.from(wrapperA.getDOMNode().children).map((child) =>
        child.getAttribute('id')
      )
    ).toEqual(['1', '2']);
    expect(
      Array.from(wrapperB.getDOMNode().children).map((child) =>
        child.getAttribute('id')
      )
    ).toEqual(['3', '4']);
  });

  test('(The first container element is not found) Send a child but not update the DOM', () => {
    parentA.stateNode = null;

    const position = sendChild(parentA, parentB, '1', 0);
    // The position is correct.
    expect(position).toBe(0);
    // Warning calls.
    expect(warning).toHaveBeenCalledTimes(1);
    // The indices are updated.
    expect(getFibersIndices(parentA)).toEqual([0]);
    expect(getFibersIndices(parentB)).toEqual([0, 1, 2]);
    // The keys are in the correct order.
    expect(getFibersKeys(parentA)).toEqual(['2']);
    expect(getFibersKeys(parentB)).toEqual(['1', '3', '4']);
    // The children are in the correct order.
    expect(
      Array.from(wrapperA.getDOMNode().children).map((child) =>
        child.getAttribute('id')
      )
    ).toEqual(['1', '2']);
    expect(
      Array.from(wrapperB.getDOMNode().children).map((child) =>
        child.getAttribute('id')
      )
    ).toEqual(['3', '4']);
  });

  test('(The second container element is not found) Send a child but not update the DOM', () => {
    parentB.stateNode = null;

    const position = sendChild(parentA, parentB, '1', 0);
    // The position is correct.
    expect(position).toBe(0);
    // Warning calls.
    expect(warning).toHaveBeenCalledTimes(1);
    // The indices are updated.
    expect(getFibersIndices(parentA)).toEqual([0]);
    expect(getFibersIndices(parentB)).toEqual([0, 1, 2]);
    // The keys are in the correct order.
    expect(getFibersKeys(parentA)).toEqual(['2']);
    expect(getFibersKeys(parentB)).toEqual(['1', '3', '4']);
    // The children are in the correct order.
    expect(
      Array.from(wrapperA.getDOMNode().children).map((child) =>
        child.getAttribute('id')
      )
    ).toEqual(['1', '2']);
    expect(
      Array.from(wrapperB.getDOMNode().children).map((child) =>
        child.getAttribute('id')
      )
    ).toEqual(['3', '4']);
  });
});
