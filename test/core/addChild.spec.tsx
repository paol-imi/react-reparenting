import React, {createRef} from 'react';
import type {Fiber} from 'react-reconciler';
import {mount} from 'enzyme';
import type {ReactWrapper} from 'enzyme';
import {getFibersKeys, getFibersIndices, getChildrenIds} from '../__shared__';
import {addChild, getFiberFromElementInstance} from '../../src';
import {warning} from '../../src/warning';

// Refs.
const parentElementRef = createRef<HTMLDivElement>();
const childElementRef = createRef<HTMLDivElement>();
// Wrappers.
let parentWrapper: ReactWrapper;
let childWrapper: ReactWrapper;
// Parent fibers.
let parent: Fiber;
let child: Fiber;

beforeEach(() => {
  // Mount the components.
  parentWrapper = mount(
    <div ref={parentElementRef}>
      <div key="1" id="1" />
      <div key="2" id="2" />
    </div>
  );
  childWrapper = mount(
    <div>
      <div key="3" id="3" ref={childElementRef} />
    </div>
  );

  // Parents.
  parent = getFiberFromElementInstance(parentElementRef.current);
  child = getFiberFromElementInstance(childElementRef.current);

  // Clear the mock.
  (warning as jest.Mock).mockClear();
});

describe('How addChild( ) works', () => {
  test('Add a child at the beginning', () => {
    const position = addChild(parent, child, 0);
    // The position is correct.
    expect(position).toBe(0);
    // Warning calls.
    expect(warning).not.toHaveBeenCalled();
    // The indices are updated.
    expect(getFibersIndices(parent)).toEqual([0, 1, 2]);
    // The keys are in the correct order.
    expect(getFibersKeys(parent)).toEqual(['3', '1', '2']);
    // The children are in the correct order.
    expect(getChildrenIds(parentWrapper.getDOMNode())).toEqual(['3', '1', '2']);
  });

  test('Add a child at the bottom', () => {
    const position = addChild(parent, child, -1);
    // The position is correct.
    expect(position).toBe(2);
    // Warning calls.
    expect(warning).not.toHaveBeenCalled();
    // The indices are updated.
    expect(getFibersIndices(parent)).toEqual([0, 1, 2]);
    // The keys are in the correct order.
    expect(getFibersKeys(parent)).toEqual(['1', '2', '3']);
    // The children are in the correct order.
    expect(getChildrenIds(parentWrapper.getDOMNode())).toEqual(['1', '2', '3']);
  });

  test('Add a child in the position of the child with the key "1"', () => {
    const position = addChild(parent, child, '1');
    // The position is correct.
    expect(position).toBe(0);
    // Warning calls.
    expect(warning).not.toHaveBeenCalled();
    // The indices are updated.
    expect(getFibersIndices(parent)).toEqual([0, 1, 2]);
    // The keys are in the correct order.
    expect(getFibersKeys(parent)).toEqual(['3', '1', '2']);
    // The children are in the correct order.
    expect(getChildrenIds(parentWrapper.getDOMNode())).toEqual(['3', '1', '2']);
  });

  test('Add a child in the position of the child with the key "2"', () => {
    const position = addChild(parent, child, '2');
    // The position is correct.
    expect(position).toBe(1);
    // Warning calls.
    expect(warning).not.toHaveBeenCalled();
    // The indices are updated.
    expect(getFibersIndices(parent)).toEqual([0, 1, 2]);
    // The keys are in the correct order.
    expect(getFibersKeys(parent)).toEqual(['1', '3', '2']);
    // The children are in the correct order.
    expect(getChildrenIds(parentWrapper.getDOMNode())).toEqual(['1', '3', '2']);
  });

  test('(Provide a not valid position index) Add a child at the bottom', () => {
    const position = addChild(parent, child, 5);
    // The position is correct.
    expect(position).toBe(2);
    // Warning calls.
    expect(warning).toHaveBeenCalledTimes(1);
    // The indices are updated.
    expect(getFibersIndices(parent)).toEqual([0, 1, 2]);
    // The keys are in the correct order.
    expect(getFibersKeys(parent)).toEqual(['1', '2', '3']);
    // The children are in the correct order.
    expect(getChildrenIds(parentWrapper.getDOMNode())).toEqual(['1', '2', '3']);
  });

  test('(Provide a not valid position key) Add a child at the bottom', () => {
    const position = addChild(parent, child, '5');
    // The position is correct.
    expect(position).toBe(2);
    // Warning calls.
    expect(warning).toHaveBeenCalledTimes(1);
    // The indices are updated.
    expect(getFibersIndices(parent)).toEqual([0, 1, 2]);
    // The keys are in the correct order.
    expect(getFibersKeys(parent)).toEqual(['1', '2', '3']);
    // The children are in the correct order.
    expect(getChildrenIds(parentWrapper.getDOMNode())).toEqual(['1', '2', '3']);
  });

  test('(With only parent alternate) Add a child at the beginning', () => {
    parentWrapper.setProps({});

    const position = addChild(parent.alternate, child, 0);
    // The position is correct.
    expect(position).toBe(0);
    // Warning calls.
    expect(warning).not.toHaveBeenCalled();
    // The indices are updated.
    expect(getFibersIndices(parent.alternate)).toEqual([0, 1, 2]);
    expect(getFibersIndices(parent)).toEqual([0, 1]);
    // The keys are in the correct order.
    expect(getFibersKeys(parent.alternate)).toEqual(['3', '1', '2']);
    expect(getFibersKeys(parent)).toEqual(['1', '2']);
    // The children are in the correct order.
    expect(getChildrenIds(parentWrapper.getDOMNode())).toEqual(['3', '1', '2']);
  });

  test('(With only child alternate) Add a child at the beginning', () => {
    childWrapper.setProps({});

    const position = addChild(parent, child, 0);
    // The position is correct.
    expect(position).toBe(0);
    // Warning calls.
    expect(warning).not.toHaveBeenCalled();
    // The indices are updated.
    expect(getFibersIndices(parent)).toEqual([0, 1, 2]);
    // The keys are in the correct order.
    expect(getFibersKeys(parent)).toEqual(['3', '1', '2']);
    // The children are in the correct order.
    expect(getChildrenIds(parentWrapper.getDOMNode())).toEqual(['3', '1', '2']);
    // The alternate is not removed.
    expect(child.alternate).not.toBe(null);
    // The alternate references are removed.
    expect(child.alternate.return).toBe(null);
    expect(child.alternate.sibling).toBe(null);
  });

  test('(With parent and child alternates) Add a child at the beginning', () => {
    parentWrapper.setProps({});
    childWrapper.setProps({});

    const position = addChild(parent.alternate, child, 0);
    // The position is correct.
    expect(position).toBe(0);
    // Warning calls.
    expect(warning).not.toHaveBeenCalled();
    // The indices are updated.
    expect(getFibersIndices(parent.alternate)).toEqual([0, 1, 2]);
    expect(getFibersIndices(parent)).toEqual([0, 1, 2]);
    // The keys are in the correct order.
    expect(getFibersKeys(parent.alternate)).toEqual(['3', '1', '2']);
    expect(getFibersKeys(parent)).toEqual(['3', '1', '2']);
    // The children are in the correct order.
    expect(getChildrenIds(parentWrapper.getDOMNode())).toEqual(['3', '1', '2']);
  });

  test('(With parent and child alternates) Add a child in the position of the child with the key "2"', () => {
    parentWrapper.setProps({});
    childWrapper.setProps({});

    const position = addChild(parent.alternate, child, '2');
    // The position is correct.
    expect(position).toBe(1);
    // Warning calls.
    expect(warning).not.toHaveBeenCalled();
    // The indices are updated.
    expect(getFibersIndices(parent.alternate)).toEqual([0, 1, 2]);
    expect(getFibersIndices(parent)).toEqual([0, 1, 2]);
    // The keys are in the correct order.
    expect(getFibersKeys(parent.alternate)).toEqual(['1', '3', '2']);
    expect(getFibersKeys(parent)).toEqual(['1', '3', '2']);
    // The children are in the correct order.
    expect(getChildrenIds(parentWrapper.getDOMNode())).toEqual(['1', '3', '2']);
  });

  test('(Enable skipUpdate option) Add a child but not update the DOM', () => {
    const position = addChild(parent, child, 0, true);
    // The position is correct.
    expect(position).toBe(0);
    // Warning calls.
    expect(warning).not.toHaveBeenCalled();
    // The indices are updated.
    expect(getFibersIndices(parent)).toEqual([0, 1, 2]);
    // The keys are in the correct order.
    expect(getFibersKeys(parent)).toEqual(['3', '1', '2']);
    // The children are in the correct order.
    expect(getChildrenIds(parentWrapper.getDOMNode())).toEqual(['1', '2']);
  });

  test('(The child element is not found) Add a child but not update the DOM', () => {
    child.stateNode = null;

    const position = addChild(parent, child, 0);
    // The position is correct.
    expect(position).toBe(0);
    // Warning calls.
    expect(warning).toHaveBeenCalledTimes(1);
    // The indices are updated.
    expect(getFibersIndices(parent)).toEqual([0, 1, 2]);
    // The keys are in the correct order.
    expect(getFibersKeys(parent)).toEqual(['3', '1', '2']);
    // The children are in the correct order.
    expect(getChildrenIds(parentWrapper.getDOMNode())).toEqual(['1', '2']);
  });

  test('(The child element before is not found) Add a child but not update the DOM', () => {
    parent.child.stateNode = null;

    const position = addChild(parent, child, 0);
    // The position is correct.
    expect(position).toBe(0);
    // Warning calls.
    expect(warning).toHaveBeenCalledTimes(1);
    // The indices are updated.
    expect(getFibersIndices(parent)).toEqual([0, 1, 2]);
    // The keys are in the correct order.
    expect(getFibersKeys(parent)).toEqual(['3', '1', '2']);
    // The children are in the correct order.
    expect(getChildrenIds(parentWrapper.getDOMNode())).toEqual(['1', '2']);
  });

  test('(The container element is not found) Add a child but not update the DOM', () => {
    parent.stateNode = null;

    const position = addChild(parent, child, 0);
    // The position is correct.
    expect(position).toBe(0);
    // Warning calls.
    expect(warning).toHaveBeenCalledTimes(1);
    // The indices are updated.
    expect(getFibersIndices(parent)).toEqual([0, 1, 2]);
    // The keys are in the correct order.
    expect(getFibersKeys(parent)).toEqual(['3', '1', '2']);
    // The children are in the correct order.
    expect(getChildrenIds(parentWrapper.getDOMNode())).toEqual(['1', '2']);
  });
});
