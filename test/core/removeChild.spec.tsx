import React, {createRef} from 'react';
import type {Fiber} from 'react-reconciler';
import {mount} from 'enzyme';
import type {ReactWrapper} from 'enzyme';
import {getFibersKeys, getFibersIndices, getChildrenIds} from '../__shared__';
import {addChild, removeChild, getFiberFromElementInstance} from '../../src';
import {Invariant} from '../../src/invariant';
import {warning} from '../../src/warning';

// Refs.
const parentElementRef = createRef<HTMLDivElement>();
// Wrappers.
let parentWrapper: ReactWrapper;
// Parent fibers.
let parent: Fiber;

beforeEach(() => {
  // Mount the components.
  parentWrapper = mount(
    <div ref={parentElementRef}>
      <div key="1" id="1" />
      <div key="2" id="2" />
    </div>
  );

  // Parents.
  parent = getFiberFromElementInstance(parentElementRef.current);

  // Clear the mock.
  (warning as jest.Mock).mockClear();
});

describe('How removeChild( ) works', () => {
  test('Remove the first child', () => {
    const child = removeChild(parent, 0);
    // The child is found.
    expect(child).not.toBe(null);
    // The key is correct.
    expect(child.key).toBe('1');
    // Warning calls.
    expect(warning).not.toHaveBeenCalled();
    // The indices are updated.
    expect(getFibersIndices(parent)).toEqual([0]);
    // The keys are in the correct order.
    expect(getFibersKeys(parent)).toEqual(['2']);
    // The children are correct.
    expect(getChildrenIds(parentWrapper.getDOMNode())).toEqual(['2']);
  });

  test('Remove the second child', () => {
    const child = removeChild(parent, 1);
    // The child is found.
    expect(child).not.toBe(null);
    // The key is correct.
    expect(child.key).toBe('2');
    // Warning calls.
    expect(warning).not.toHaveBeenCalled();
    // The indices are updated.
    expect(getFibersIndices(parent)).toEqual([0]);
    // The keys are in the correct order.
    expect(getFibersKeys(parent)).toEqual(['1']);
    // The children are correct.
    expect(getChildrenIds(parentWrapper.getDOMNode())).toEqual(['1']);
  });

  test('Remove the child with the key "1"', () => {
    const child = removeChild(parent, '1');
    // The child is found.
    expect(child).not.toBe(null);
    // The key is correct.
    expect(child.key).toBe('1');
    // Warning calls.
    expect(warning).not.toHaveBeenCalled();
    // The indices are updated.
    expect(getFibersIndices(parent)).toEqual([0]);
    // The keys are in the correct order.
    expect(getFibersKeys(parent)).toEqual(['2']);
    // The children are correct.
    expect(getChildrenIds(parentWrapper.getDOMNode())).toEqual(['2']);
  });

  test('Remove the child with the key "2"', () => {
    const child = removeChild(parent, '2');
    // The child is found.
    expect(child).not.toBe(null);
    // The key is correct.
    expect(child.key).toBe('2');
    // Warning calls.
    expect(warning).not.toHaveBeenCalled();
    // The indices are updated.
    expect(getFibersIndices(parent)).toEqual([0]);
    // The keys are in the correct order.
    expect(getFibersKeys(parent)).toEqual(['1']);
    // The children are correct.
    expect(getChildrenIds(parentWrapper.getDOMNode())).toEqual(['1']);
  });

  test('(Provide a index bigger than the number of children) Not remove the child', () => {
    const child = removeChild(parent, 5);
    // The child is not found.
    expect(child).toBe(null);
    // Warning calls.
    expect(warning).toHaveBeenCalledTimes(1);
    // The indices are updated.
    expect(getFibersIndices(parent)).toEqual([0, 1]);
    // The keys are in the correct order.
    expect(getFibersKeys(parent)).toEqual(['1', '2']);
    // The children are correct.
    expect(getChildrenIds(parentWrapper.getDOMNode())).toEqual(['1', '2']);
  });

  test('(Provide a not valid key) Not remove the child', () => {
    const child = removeChild(parent, '5');
    // The child is not found.
    expect(child).toBe(null);
    // Warning calls.
    expect(warning).toHaveBeenCalledTimes(1);
    // The indices are updated.
    expect(getFibersIndices(parent)).toEqual([0, 1]);
    // The keys are in the correct order.
    expect(getFibersKeys(parent)).toEqual(['1', '2']);
    // The children are correct.
    expect(getChildrenIds(parentWrapper.getDOMNode())).toEqual(['1', '2']);
  });

  test('(With only parent alternate) Remove the first child', () => {
    // Generate the parent alternate.
    parentWrapper.setProps({});

    const ref = createRef<HTMLDivElement>();
    // Generate a fiber without alternate.
    mount(<div id="3" ref={ref} />);
    // Add the fiber.
    addChild(parent, getFiberFromElementInstance(ref.current), 0);

    const child = removeChild(parent, 0);
    // The child is found.
    expect(child).not.toBe(null);
    // The child has an alternate.
    expect(child.alternate).toBe(null);
    // Warning calls.
    expect(warning).not.toHaveBeenCalled();
    // The indices are updated.
    expect(getFibersIndices(parent.alternate)).toEqual([0, 1]);
    expect(getFibersIndices(parent)).toEqual([0, 1]);
    // The keys are in the correct order.
    expect(getFibersKeys(parent.alternate)).toEqual(['1', '2']);
    expect(getFibersKeys(parent)).toEqual(['1', '2']);
    // The children are correct.
    expect(getChildrenIds(parentWrapper.getDOMNode())).toEqual(['1', '2']);
  });

  test('(With only child alternate) Remove the first child', () => {
    const ref = createRef<HTMLDivElement>();
    // Generate a fiber with an alternate.
    mount(<div id="3" ref={ref} />).setProps({});
    // Add the fiber.
    addChild(parent, getFiberFromElementInstance(ref.current), 0);

    const child = removeChild(parent, 0);
    // The child is found.
    expect(child).not.toBe(null);
    // The child has an alternate.
    expect(child.alternate).not.toBe(null);
    // Warning calls.
    expect(warning).not.toHaveBeenCalled();
    // The indices are updated.
    expect(getFibersIndices(parent)).toEqual([0, 1]);
    // The keys are in the correct order.
    expect(getFibersKeys(parent)).toEqual(['1', '2']);
    // The children are correct.
    expect(getChildrenIds(parentWrapper.getDOMNode())).toEqual(['1', '2']);
  });

  test('(With parent and child alternates) Remove the first child', () => {
    parentWrapper.setProps({});

    const child = removeChild(parent, 0);
    // The child is found.
    expect(child).not.toBe(null);
    // The child has an alternate.
    expect(child.alternate).not.toBe(null);
    // The key is correct.
    expect(child.key).toBe('1');
    // Warning calls.
    expect(warning).not.toHaveBeenCalled();
    // The indices are updated.
    expect(getFibersIndices(parent.alternate)).toEqual([0]);
    expect(getFibersIndices(parent)).toEqual([0]);
    // The keys are in the correct order.
    expect(getFibersKeys(parent.alternate)).toEqual(['2']);
    expect(getFibersKeys(parent)).toEqual(['2']);
    // The children are correct.
    expect(getChildrenIds(parentWrapper.getDOMNode())).toEqual(['2']);
  });

  test('(With parent and child alternates) Remove the child with the key "2"', () => {
    parentWrapper.setProps({});

    const child = removeChild(parent, '2');
    // The child is found.
    expect(child).not.toBe(null);
    // The child has an alternate.
    expect(child.alternate).not.toBe(null);
    // The key is correct.
    expect(child.key).toBe('2');
    // Warning calls.
    expect(warning).not.toHaveBeenCalled();
    // The indices are updated.
    expect(getFibersIndices(parent.alternate)).toEqual([0]);
    expect(getFibersIndices(parent)).toEqual([0]);
    // The keys are in the correct order.
    expect(getFibersKeys(parent.alternate)).toEqual(['1']);
    expect(getFibersKeys(parent)).toEqual(['1']);
    // The children are correct.
    expect(getChildrenIds(parentWrapper.getDOMNode())).toEqual(['1']);
  });

  test('(Enable skipUpdate option) Send a child but not update the DOM', () => {
    const child = removeChild(parent, 0, true);
    // The child is found.
    expect(child).not.toBe(null);
    // The key is correct.
    expect(child.key).toBe('1');
    // Warning calls.
    expect(warning).not.toHaveBeenCalled();
    // The indices are updated.
    expect(getFibersIndices(parent)).toEqual([0]);
    // The keys are in the correct order.
    expect(getFibersKeys(parent)).toEqual(['2']);
    // The children are correct.
    expect(getChildrenIds(parentWrapper.getDOMNode())).toEqual(['1', '2']);
  });

  test('(The child element is not found) Send a child but not update the DOM', () => {
    parent.child.stateNode = null;

    const child = removeChild(parent, 0);
    // The child is found.
    expect(child).not.toBe(null);
    // The key is correct.
    expect(child.key).toBe('1');
    // Warning calls.
    expect(warning).toHaveBeenCalledTimes(1);
    // The indices are updated.
    expect(getFibersIndices(parent)).toEqual([0]);
    // The keys are in the correct order.
    expect(getFibersKeys(parent)).toEqual(['2']);
    // The children are correct.
    expect(getChildrenIds(parentWrapper.getDOMNode())).toEqual(['1', '2']);
  });

  test('(The container element is not found) Send a child but not update the DOM', () => {
    parent.stateNode = null;

    const child = removeChild(parent, 0);
    // The child is found.
    expect(child).not.toBe(null);
    // The key is correct.
    expect(child.key).toBe('1');
    // Warning calls.
    expect(warning).toHaveBeenCalledTimes(1);
    // The indices are updated.
    expect(getFibersIndices(parent)).toEqual([0]);
    // The keys are in the correct order.
    expect(getFibersKeys(parent)).toEqual(['2']);
    // The children are correct.
    expect(getChildrenIds(parentWrapper.getDOMNode())).toEqual(['1', '2']);
  });

  test('(Provide an index less than 0) Throw an Invariant', () => {
    expect(() => {
      removeChild(parent, -1);
    }).toThrow(Invariant);
  });
});
