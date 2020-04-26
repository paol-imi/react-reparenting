import React, {createRef} from 'react';
import {mount} from 'enzyme';
import type {ReactWrapper} from 'enzyme';
import {getFibersKeys, getFibersIndices, warn} from '../__shared__';
import {Parent, findChildFiber} from '../../src';
import type {ParentFiber} from '../../src';
import {Invariant} from '../../src/invariant';

// Refs.
const parentARef = createRef<ParentFiber>();
const parentBRef = createRef<ParentFiber>();
// Wrappers.
let wrapperA: ReactWrapper;
let wrapperB: ReactWrapper;
// Parent fibers.
let parentA: ParentFiber;
let parentB: ParentFiber;

beforeEach(() => {
  // Mount the components.
  wrapperA = mount(
    <div>
      <Parent parentRef={parentARef}>
        <div key="1" id="1" />
        <div key="2" id="2" />
      </Parent>
    </div>
  );
  wrapperB = mount(
    <div>
      <Parent parentRef={parentBRef}>
        <div key="3" id="3" />
        <div key="4" id="4" />
      </Parent>
    </div>
  );

  // Parents.
  parentA = parentARef.current;
  parentB = parentBRef.current;

  // Clear the mock.
  warn.mockClear();
});

describe('How the ParentFiber works', () => {
  test('Send the child with the key "1" in the position of the current first child', () => {
    const position = parentA.send('1', parentB, 0);
    // The position is correct.
    expect(position).toBe(0);
    // Warning calls.
    expect(warn).not.toHaveBeenCalled();
    // The indices are updated.
    expect(getFibersIndices(parentA.getFiber())).toEqual([0]);
    expect(getFibersIndices(parentB.getFiber())).toEqual([0, 1, 2]);
    // The keys are in the correct order.
    expect(getFibersKeys(parentA.getFiber())).toEqual(['2']);
    expect(getFibersKeys(parentB.getFiber())).toEqual(['1', '3', '4']);
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

  test('Send the child with the key "1" in the last position', () => {
    const position = parentA.send('1', parentB, -1);
    // The position is correct.
    expect(position).toBe(2);
    // Warning calls.
    expect(warn).not.toHaveBeenCalled();
    // The indices are updated.
    expect(getFibersIndices(parentA.getFiber())).toEqual([0]);
    expect(getFibersIndices(parentB.getFiber())).toEqual([0, 1, 2]);
    // The keys are in the correct order.
    expect(getFibersKeys(parentA.getFiber())).toEqual(['2']);
    expect(getFibersKeys(parentB.getFiber())).toEqual(['3', '4', '1']);
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

  test('Send the first child in the position of the child with the key "4"', () => {
    const position = parentA.send(0, parentB, '4');
    // The position is correct.
    expect(position).toBe(1);
    // Warning calls.
    expect(warn).not.toHaveBeenCalled();
    // The indices are updated.
    expect(getFibersIndices(parentA.getFiber())).toEqual([0]);
    expect(getFibersIndices(parentB.getFiber())).toEqual([0, 1, 2]);
    // The keys are in the correct order.
    expect(getFibersKeys(parentA.getFiber())).toEqual(['2']);
    expect(getFibersKeys(parentB.getFiber())).toEqual(['3', '1', '4']);
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
    ).toEqual(['3', '1', '4']);
  });

  test('Send all the children after the child with the key "4"', () => {
    const position1 = parentA.send(0, parentB, '4');
    const position2 = parentA.send(0, parentB, '4');
    // The position is correct.
    expect(position1).toBe(1);
    expect(position2).toBe(2);
    // Warning calls.
    expect(warn).not.toHaveBeenCalled();
    // The indices are updated.
    expect(getFibersIndices(parentA.getFiber())).toEqual([]);
    expect(getFibersIndices(parentB.getFiber())).toEqual([0, 1, 2, 3]);
    // The keys are in the correct order.
    expect(getFibersKeys(parentA.getFiber())).toEqual([]);
    expect(getFibersKeys(parentB.getFiber())).toEqual(['3', '1', '2', '4']);
    // The children are in the correct order.
    expect(
      Array.from(wrapperA.getDOMNode().children).map((child) =>
        child.getAttribute('id')
      )
    ).toEqual([]);
    expect(
      Array.from(wrapperB.getDOMNode().children).map((child) =>
        child.getAttribute('id')
      )
    ).toEqual(['3', '1', '2', '4']);
  });

  test('(Load alternates A and B) Send the child with the key "1" in the position of the current first child', () => {
    // Generate the alternate with a re-render.
    wrapperA.setProps({
      children: (
        <Parent parentRef={parentARef}>
          <div key="1" id="1" />
          <div key="2" id="2" />
        </Parent>
      ),
    });
    wrapperB.setProps({
      children: (
        <Parent parentRef={parentARef}>
          <div key="3" id="3" />
          <div key="4" id="4" />
        </Parent>
      ),
    });

    const position = parentA.send('1', parentB, 0);
    // The position is correct.
    expect(position).toBe(0);
    // Warning calls.
    expect(warn).not.toHaveBeenCalled();
    // The indices are updated.
    expect(getFibersIndices(parentA.getFiber())).toEqual([0]);
    expect(getFibersIndices(parentB.getFiber())).toEqual([0, 1, 2]);
    // The keys are in the correct order.
    expect(getFibersKeys(parentA.getFiber())).toEqual(['2']);
    expect(getFibersKeys(parentB.getFiber())).toEqual(['1', '3', '4']);
    // The indices are updated.
    expect(getFibersIndices(parentA.getFiber().alternate)).toEqual([0]);
    expect(getFibersIndices(parentB.getFiber().alternate)).toEqual([0, 1, 2]);
    // The keys are in the correct order.
    expect(getFibersKeys(parentA.getFiber().alternate)).toEqual(['2']);
    expect(getFibersKeys(parentB.getFiber().alternate)).toEqual([
      '1',
      '3',
      '4',
    ]);
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

  test('(Load alternate A) Send the child with the key "1" in the position of the current first child', () => {
    // Generate the alternate with a re-render.
    wrapperA.setProps({
      children: (
        <Parent parentRef={parentARef}>
          <div key="1" id="1" />
          <div key="2" id="2" />
        </Parent>
      ),
    });

    const position = parentA.send('1', parentB, 0);
    // The position is correct.
    expect(position).toBe(0);
    // Warning calls.
    expect(warn).not.toHaveBeenCalled();
    // The indices are updated.
    expect(getFibersIndices(parentA.getFiber())).toEqual([0]);
    expect(getFibersIndices(parentB.getFiber())).toEqual([0, 1, 2]);
    // The keys are in the correct order.
    expect(getFibersKeys(parentA.getFiber())).toEqual(['2']);
    expect(getFibersKeys(parentB.getFiber())).toEqual(['1', '3', '4']);
    // The indices are updated.
    expect(getFibersIndices(parentA.getFiber().alternate)).toEqual([0]);
    // The keys are in the correct order.
    expect(getFibersKeys(parentA.getFiber().alternate)).toEqual(['2']);
    // Expect that the alternate of the sent fiber has been removed.
    expect(findChildFiber(parentB.getFiber(), '1').alternate).toBe(null);
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

  test('(Load alternate B) Send the child with the key "1" in the position of the current first child', () => {
    // Generate the alternate with a re-render.
    wrapperB.setProps({
      children: (
        <Parent parentRef={parentARef}>
          <div key="3" id="3" />
          <div key="4" id="4" />
        </Parent>
      ),
    });

    const position = parentA.send('1', parentB, 0);
    // The position is correct.
    expect(position).toBe(0);
    // Warning calls.
    expect(warn).not.toHaveBeenCalled();
    // The indices are updated.
    expect(getFibersIndices(parentA.getFiber())).toEqual([0]);
    expect(getFibersIndices(parentB.getFiber())).toEqual([0, 1, 2]);
    // The keys are in the correct order.
    expect(getFibersKeys(parentA.getFiber())).toEqual(['2']);
    expect(getFibersKeys(parentB.getFiber())).toEqual(['1', '3', '4']);
    // The indices are updated.
    expect(getFibersIndices(parentB.getFiber().alternate)).toEqual([0, 1]);
    // The keys are in the correct order.
    expect(getFibersKeys(parentB.getFiber().alternate)).toEqual(['3', '4']);
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

  test('(Provide a not valid child index) Not send the child', () => {
    const position = parentA.send(5, parentB, '4');
    // The position is correct.
    expect(position).toBe(-1);
    // Warning calls.
    expect(warn).toHaveBeenCalled();
    // The indices are updated.
    expect(getFibersIndices(parentA.getFiber())).toEqual([0, 1]);
    expect(getFibersIndices(parentB.getFiber())).toEqual([0, 1]);
    // The keys are in the correct order.
    expect(getFibersKeys(parentA.getFiber())).toEqual(['1', '2']);
    expect(getFibersKeys(parentB.getFiber())).toEqual(['3', '4']);
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

  test('(Provide a not valid child key) Not send the child', () => {
    const position = parentA.send('5', parentB, '4');
    // The position is correct.
    expect(position).toBe(-1);
    // Warning calls.
    expect(warn).toHaveBeenCalled();
    // The indices are updated.
    expect(getFibersIndices(parentA.getFiber())).toEqual([0, 1]);
    expect(getFibersIndices(parentB.getFiber())).toEqual([0, 1]);
    // The keys are in the correct order.
    expect(getFibersKeys(parentA.getFiber())).toEqual(['1', '2']);
    expect(getFibersKeys(parentB.getFiber())).toEqual(['3', '4']);
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

  test('(Provide a not valid position index) The child is added at the bottom', () => {
    const position = parentA.send(0, parentB, 5);
    // The position is correct.
    expect(position).toBe(2);
    // Warning calls.
    expect(warn).toHaveBeenCalled();
    // The indices are updated.
    expect(getFibersIndices(parentA.getFiber())).toEqual([0]);
    expect(getFibersIndices(parentB.getFiber())).toEqual([0, 1, 2]);
    // The keys are in the correct order.
    expect(getFibersKeys(parentA.getFiber())).toEqual(['2']);
    expect(getFibersKeys(parentB.getFiber())).toEqual(['3', '4', '1']);
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

  test('(Provide a not valid position key) The child is added at the bottom', () => {
    const position = parentA.send(0, parentB, '5');
    // The position is correct.
    expect(position).toBe(2);
    // Warning calls.
    expect(warn).toHaveBeenCalled();
    // The indices are updated.
    expect(getFibersIndices(parentA.getFiber())).toEqual([0]);
    expect(getFibersIndices(parentB.getFiber())).toEqual([0, 1, 2]);
    // The keys are in the correct order.
    expect(getFibersKeys(parentA.getFiber())).toEqual(['2']);
    expect(getFibersKeys(parentB.getFiber())).toEqual(['3', '4', '1']);
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

  test('(Enable skipDOMUpdate option) The DOM is not updated', () => {
    const position = parentA.send(0, parentB, 0, true);
    // The position is correct.
    expect(position).toBe(0);
    // Warning calls.
    expect(warn).not.toHaveBeenCalled();
    // The indices are updated.
    expect(getFibersIndices(parentA.getFiber())).toEqual([0]);
    expect(getFibersIndices(parentB.getFiber())).toEqual([0, 1, 2]);
    // The keys are in the correct order.
    expect(getFibersKeys(parentA.getFiber())).toEqual(['2']);
    expect(getFibersKeys(parentB.getFiber())).toEqual(['1', '3', '4']);
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

    // Send back the fiber to avoid errors on unMounting.
    parentB.send(0, parentA, 0, true);
  });

  test('The methods throw an error if the fiber is not setted', () => {
    parentA.clear();

    expect(() => {
      parentA.send('1', parentB, 0);
    }).toThrow(Invariant);
  });
});
