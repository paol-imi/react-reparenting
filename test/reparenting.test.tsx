import React, {createRef, createContext} from 'react';
import {mount} from 'enzyme';
import type {ReactWrapper} from 'enzyme';
import {Child} from './__shared__';
import type {ChildProps} from './__shared__';
import {Parent} from '../src';
import type {ParentFiber} from '../src';

// Refs.
const parentARef = createRef<ParentFiber>();
const parentBRef = createRef<ParentFiber>();
const containerARef = createRef<HTMLDivElement>();
const containerBRef = createRef<HTMLDivElement>();
// Wrappers.
let wrapperA: ReactWrapper;
let wrapperB: ReactWrapper;
// Parent fibers.
let parentA: ParentFiber;
let parentB: ParentFiber;
// Mocks.
let child1Mocks: ChildProps;
let child2Mocks: ChildProps;
let child3Mocks: ChildProps;
let child4Mocks: ChildProps;

// Mount the components before each test.
beforeEach(() => {
  // Children moks.
  child1Mocks = {
    id: '1',
    onRender: jest.fn(),
    onMount: jest.fn(),
    onUnmount: jest.fn(),
  };
  // Children moks.
  child2Mocks = {
    id: '2',
    onRender: jest.fn(),
    onMount: jest.fn(),
    onUnmount: jest.fn(),
  };
  // Children moks.
  child3Mocks = {
    id: '3',
    onRender: jest.fn(),
    onMount: jest.fn(),
    onUnmount: jest.fn(),
  };
  // Children moks.
  child4Mocks = {
    id: '4',
    onRender: jest.fn(),
    onMount: jest.fn(),
    onUnmount: jest.fn(),
  };

  // Mount the components.
  wrapperA = mount(
    <div ref={containerARef}>
      <Parent parentRef={parentARef}>
        <Child key="1" {...child1Mocks} />
        <Child key="2" {...child2Mocks} />
      </Parent>
    </div>
  );
  wrapperB = mount(
    <div ref={containerBRef}>
      <Parent parentRef={parentBRef}>
        <Child key="3" {...child3Mocks} />
        <Child key="4" {...child4Mocks} />
      </Parent>
    </div>
  );

  // Parents.
  parentA = parentARef.current;
  parentB = parentBRef.current;
});

describe('How the reparented child lifecycle works', () => {
  test('Send the child with the key "1" in the position of the current first child', () => {
    parentA.send('1', parentB, 0);

    // Update the children.
    wrapperA.setProps({
      children: (
        <Parent parentRef={parentARef}>
          <Child key="2" {...child2Mocks} />
        </Parent>
      ),
    });
    wrapperB.setProps({
      children: (
        <Parent parentRef={parentBRef}>
          <Child key="1" {...child1Mocks} />,
          <Child key="3" {...child3Mocks} />,
          <Child key="4" {...child4Mocks} />,
        </Parent>
      ),
    });

    // Child 1 lifecycle.
    expect(child1Mocks.onMount).toHaveBeenCalledTimes(1);
    expect(child1Mocks.onUnmount).toHaveBeenCalledTimes(0);
    expect(child1Mocks.onRender).toHaveBeenCalledTimes(2);
    // Child 2 lifecycle.
    expect(child2Mocks.onMount).toHaveBeenCalledTimes(1);
    expect(child2Mocks.onUnmount).toHaveBeenCalledTimes(0);
    expect(child2Mocks.onRender).toHaveBeenCalledTimes(2);
    // Child 3 lifecycle.
    expect(child3Mocks.onMount).toHaveBeenCalledTimes(1);
    expect(child3Mocks.onUnmount).toHaveBeenCalledTimes(0);
    expect(child3Mocks.onRender).toHaveBeenCalledTimes(2);
    // Child 4 lifecycle.
    expect(child4Mocks.onMount).toHaveBeenCalledTimes(1);
    expect(child4Mocks.onUnmount).toHaveBeenCalledTimes(0);
    expect(child4Mocks.onRender).toHaveBeenCalledTimes(2);

    wrapperA.unmount();

    // Child 1 lifecycle.
    expect(child1Mocks.onUnmount).toHaveBeenCalledTimes(0);
    // Child 2 lifecycle.
    expect(child2Mocks.onUnmount).toHaveBeenCalledTimes(1);
    // Child 3 lifecycle.
    expect(child3Mocks.onUnmount).toHaveBeenCalledTimes(0);
    // Child 4 lifecycle.
    expect(child4Mocks.onUnmount).toHaveBeenCalledTimes(0);

    wrapperB.unmount();

    // Child 1 lifecycle.
    expect(child1Mocks.onUnmount).toHaveBeenCalledTimes(1);
    // Child 2 lifecycle.
    expect(child2Mocks.onUnmount).toHaveBeenCalledTimes(1);
    // Child 3 lifecycle.
    expect(child3Mocks.onUnmount).toHaveBeenCalledTimes(1);
    // Child 4 lifecycle.
    expect(child4Mocks.onUnmount).toHaveBeenCalledTimes(1);
  });

  test('Send all the children after the child with the key "4"', () => {
    parentA.send('1', parentB, '4');
    parentA.send('2', parentB, '4');

    // Update the children.
    wrapperA.setProps({
      children: (
        <Parent parentRef={parentARef}>
          Some text to avoid React to log a warning about no children rendered
        </Parent>
      ),
    });
    wrapperB.setProps({
      children: (
        <Parent parentRef={parentBRef}>
          <Child key="3" {...child3Mocks} />,
          <Child key="1" {...child1Mocks} />,
          <Child key="2" {...child2Mocks} />,
          <Child key="4" {...child4Mocks} />,
        </Parent>
      ),
    });

    // Child 1 lifecycle.
    expect(child1Mocks.onMount).toHaveBeenCalledTimes(1);
    expect(child1Mocks.onUnmount).toHaveBeenCalledTimes(0);
    expect(child1Mocks.onRender).toHaveBeenCalledTimes(2);
    // Child 2 lifecycle.
    expect(child2Mocks.onMount).toHaveBeenCalledTimes(1);
    expect(child2Mocks.onUnmount).toHaveBeenCalledTimes(0);
    expect(child2Mocks.onRender).toHaveBeenCalledTimes(2);
    // Child 3 lifecycle.
    expect(child3Mocks.onMount).toHaveBeenCalledTimes(1);
    expect(child3Mocks.onUnmount).toHaveBeenCalledTimes(0);
    expect(child3Mocks.onRender).toHaveBeenCalledTimes(2);
    // Child 4 lifecycle.
    expect(child4Mocks.onMount).toHaveBeenCalledTimes(1);
    expect(child4Mocks.onUnmount).toHaveBeenCalledTimes(0);
    expect(child4Mocks.onRender).toHaveBeenCalledTimes(2);

    wrapperA.unmount();

    // Child 1 lifecycle.
    expect(child1Mocks.onUnmount).toHaveBeenCalledTimes(0);
    // Child 2 lifecycle.
    expect(child2Mocks.onUnmount).toHaveBeenCalledTimes(0);
    // Child 3 lifecycle.
    expect(child3Mocks.onUnmount).toHaveBeenCalledTimes(0);
    // Child 4 lifecycle.
    expect(child4Mocks.onUnmount).toHaveBeenCalledTimes(0);

    wrapperB.unmount();

    // Child 1 lifecycle.
    expect(child1Mocks.onUnmount).toHaveBeenCalledTimes(1);
    // Child 2 lifecycle.
    expect(child2Mocks.onUnmount).toHaveBeenCalledTimes(1);
    // Child 3 lifecycle.
    expect(child3Mocks.onUnmount).toHaveBeenCalledTimes(1);
    // Child 4 lifecycle.
    expect(child4Mocks.onUnmount).toHaveBeenCalledTimes(1);
  });
});

describe('How the state is manteined after reparenting', () => {
  test('Send the child with the key "1" in the position of the current first child', () => {
    const randomlyCalculatedState = wrapperA.find(Child).first().state();

    parentA.send('1', parentB, 0);

    // Update the children.
    wrapperA.setProps({
      children: (
        <Parent parentRef={parentARef}>
          <Child key="2" {...child2Mocks} />
        </Parent>
      ),
    });
    wrapperB.setProps({
      children: (
        <Parent parentRef={parentBRef}>
          <Child key="1" {...child1Mocks} />,
          <Child key="3" {...child3Mocks} />,
          <Child key="4" {...child4Mocks} />,
        </Parent>
      ),
    });

    expect(wrapperB.find(Child).first().state()).toBe(randomlyCalculatedState);
  });
});

describe('Reparenting after the some re-renders', () => {
  test('Rerender A and B before reparenting', () => {
    // Rerender.
    wrapperA.setProps({
      children: (
        <Parent parentRef={parentARef}>
          <Child key="1" {...child1Mocks} />,
          <Child key="2" {...child2Mocks} />,
        </Parent>
      ),
    });
    wrapperB.setProps({
      children: (
        <Parent parentRef={parentBRef}>
          <Child key="3" {...child3Mocks} />,
          <Child key="4" {...child4Mocks} />,
        </Parent>
      ),
    });

    parentA.send('1', parentB, 0);

    // Update the children.
    wrapperA.setProps({
      children: (
        <Parent parentRef={parentARef}>
          <Child key="2" {...child2Mocks} />
        </Parent>
      ),
    });
    wrapperB.setProps({
      children: (
        <Parent parentRef={parentBRef}>
          <Child key="1" {...child1Mocks} />,
          <Child key="3" {...child3Mocks} />,
          <Child key="4" {...child4Mocks} />,
        </Parent>
      ),
    });

    // The children are in the correct order.
    expect(
      Array.from(wrapperA.getDOMNode().children).map((child: HTMLElement) =>
        child.getAttribute('id')
      )
    ).toEqual(['2']);
    expect(
      Array.from(wrapperB.getDOMNode().children).map((child: HTMLElement) =>
        child.getAttribute('id')
      )
    ).toEqual(['1', '3', '4']);

    // Child 1 lifecycle.
    expect(child1Mocks.onMount).toHaveBeenCalledTimes(1);
    expect(child1Mocks.onUnmount).toHaveBeenCalledTimes(0);
    expect(child1Mocks.onRender).toHaveBeenCalledTimes(3);
    // Child 2 lifecycle.
    expect(child2Mocks.onMount).toHaveBeenCalledTimes(1);
    expect(child2Mocks.onUnmount).toHaveBeenCalledTimes(0);
    expect(child2Mocks.onRender).toHaveBeenCalledTimes(3);
    // Child 3 lifecycle.
    expect(child3Mocks.onMount).toHaveBeenCalledTimes(1);
    expect(child3Mocks.onUnmount).toHaveBeenCalledTimes(0);
    expect(child3Mocks.onRender).toHaveBeenCalledTimes(3);
    // Child 4 lifecycle.
    expect(child4Mocks.onMount).toHaveBeenCalledTimes(1);
    expect(child4Mocks.onUnmount).toHaveBeenCalledTimes(0);
    expect(child4Mocks.onRender).toHaveBeenCalledTimes(3);
  });

  test('Rerender A and B before and after reparenting', () => {
    // Rerender.
    wrapperA.setProps({
      children: (
        <Parent parentRef={parentARef}>
          <Child key="1" {...child1Mocks} />,
          <Child key="2" {...child2Mocks} />,
        </Parent>
      ),
    });
    wrapperB.setProps({
      children: (
        <Parent parentRef={parentBRef}>
          <Child key="3" {...child3Mocks} />,
          <Child key="4" {...child4Mocks} />,
        </Parent>
      ),
    });

    parentA.send('1', parentB, 0);

    // Update the children.
    wrapperA.setProps({
      children: (
        <Parent parentRef={parentARef}>
          <Child key="2" {...child2Mocks} />
        </Parent>
      ),
    });
    wrapperB.setProps({
      children: (
        <Parent parentRef={parentBRef}>
          <Child key="1" {...child1Mocks} />,
          <Child key="3" {...child3Mocks} />,
          <Child key="4" {...child4Mocks} />,
        </Parent>
      ),
    });

    // Rerender.
    wrapperA.setProps({
      children: (
        <Parent parentRef={parentARef}>
          <Child key="2" {...child2Mocks} />
        </Parent>
      ),
    });
    wrapperB.setProps({
      children: (
        <Parent parentRef={parentBRef}>
          <Child key="1" {...child1Mocks} />,
          <Child key="3" {...child3Mocks} />,
          <Child key="4" {...child4Mocks} />,
        </Parent>
      ),
    });

    // The children are in the correct order.
    expect(
      Array.from(wrapperA.getDOMNode().children).map((child: HTMLElement) =>
        child.getAttribute('id')
      )
    ).toEqual(['2']);
    expect(
      Array.from(wrapperB.getDOMNode().children).map((child: HTMLElement) =>
        child.getAttribute('id')
      )
    ).toEqual(['1', '3', '4']);

    // Child 1 lifecycle.
    expect(child1Mocks.onMount).toHaveBeenCalledTimes(1);
    expect(child1Mocks.onUnmount).toHaveBeenCalledTimes(0);
    expect(child1Mocks.onRender).toHaveBeenCalledTimes(4);
    // Child 2 lifecycle.
    expect(child2Mocks.onMount).toHaveBeenCalledTimes(1);
    expect(child2Mocks.onUnmount).toHaveBeenCalledTimes(0);
    expect(child2Mocks.onRender).toHaveBeenCalledTimes(4);
    // Child 3 lifecycle.
    expect(child3Mocks.onMount).toHaveBeenCalledTimes(1);
    expect(child3Mocks.onUnmount).toHaveBeenCalledTimes(0);
    expect(child3Mocks.onRender).toHaveBeenCalledTimes(4);
    // Child 4 lifecycle.
    expect(child4Mocks.onMount).toHaveBeenCalledTimes(1);
    expect(child4Mocks.onUnmount).toHaveBeenCalledTimes(0);
    expect(child4Mocks.onRender).toHaveBeenCalledTimes(4);
  });

  test('Rerender A before reparenting, rerender A and B after reparenting', () => {
    // Rerender.
    wrapperA.setProps({
      children: (
        <Parent parentRef={parentARef}>
          <Child key="1" {...child1Mocks} />,
          <Child key="2" {...child2Mocks} />,
        </Parent>
      ),
    });

    parentA.send('1', parentB, 0);

    // Update the children.
    wrapperA.setProps({
      children: (
        <Parent parentRef={parentARef}>
          <Child key="2" {...child2Mocks} />
        </Parent>
      ),
    });
    wrapperB.setProps({
      children: (
        <Parent parentRef={parentBRef}>
          <Child key="1" {...child1Mocks} />,
          <Child key="3" {...child3Mocks} />,
          <Child key="4" {...child4Mocks} />,
        </Parent>
      ),
    });

    // Rerender.
    wrapperA.setProps({
      children: (
        <Parent parentRef={parentARef}>
          <Child key="2" {...child2Mocks} />
        </Parent>
      ),
    });
    wrapperB.setProps({
      children: (
        <Parent parentRef={parentBRef}>
          <Child key="1" {...child1Mocks} />,
          <Child key="3" {...child3Mocks} />,
          <Child key="4" {...child4Mocks} />,
        </Parent>
      ),
    });

    // The children are in the correct order.
    expect(
      Array.from(wrapperA.getDOMNode().children).map((child: HTMLElement) =>
        child.getAttribute('id')
      )
    ).toEqual(['2']);
    expect(
      Array.from(wrapperB.getDOMNode().children).map((child: HTMLElement) =>
        child.getAttribute('id')
      )
    ).toEqual(['1', '3', '4']);

    // Child 1 lifecycle.
    expect(child1Mocks.onMount).toHaveBeenCalledTimes(1);
    expect(child1Mocks.onUnmount).toHaveBeenCalledTimes(0);
    expect(child1Mocks.onRender).toHaveBeenCalledTimes(4);
    // Child 2 lifecycle.
    expect(child2Mocks.onMount).toHaveBeenCalledTimes(1);
    expect(child2Mocks.onUnmount).toHaveBeenCalledTimes(0);
    expect(child2Mocks.onRender).toHaveBeenCalledTimes(4);
    // Child 3 lifecycle.
    expect(child3Mocks.onMount).toHaveBeenCalledTimes(1);
    expect(child3Mocks.onUnmount).toHaveBeenCalledTimes(0);
    expect(child3Mocks.onRender).toHaveBeenCalledTimes(3);
    // Child 4 lifecycle.
    expect(child4Mocks.onMount).toHaveBeenCalledTimes(1);
    expect(child4Mocks.onUnmount).toHaveBeenCalledTimes(0);
    expect(child4Mocks.onRender).toHaveBeenCalledTimes(3);
  });

  test('Rerender B before reparenting, rerender A and B after reparenting', () => {
    // Rerender.
    wrapperB.setProps({
      children: (
        <Parent parentRef={parentBRef}>
          <Child key="3" {...child3Mocks} />,
          <Child key="4" {...child4Mocks} />,
        </Parent>
      ),
    });

    parentA.send('1', parentB, 0);

    // Update the children.
    wrapperA.setProps({
      children: (
        <Parent parentRef={parentARef}>
          <Child key="2" {...child2Mocks} />
        </Parent>
      ),
    });
    wrapperB.setProps({
      children: (
        <Parent parentRef={parentBRef}>
          <Child key="1" {...child1Mocks} />,
          <Child key="3" {...child3Mocks} />,
          <Child key="4" {...child4Mocks} />,
        </Parent>
      ),
    });

    // rerender.
    wrapperA.setProps({
      children: (
        <Parent parentRef={parentARef}>
          <Child key="2" {...child2Mocks} />
        </Parent>
      ),
    });
    wrapperB.setProps({
      children: (
        <Parent parentRef={parentBRef}>
          <Child key="1" {...child1Mocks} />,
          <Child key="3" {...child3Mocks} />,
          <Child key="4" {...child4Mocks} />,
        </Parent>
      ),
    });

    // The children are in the correct order.
    expect(
      Array.from(wrapperA.getDOMNode().children).map((child: HTMLElement) =>
        child.getAttribute('id')
      )
    ).toEqual(['2']);
    expect(
      Array.from(wrapperB.getDOMNode().children).map((child: HTMLElement) =>
        child.getAttribute('id')
      )
    ).toEqual(['1', '3', '4']);

    // Child 1 lifecycle.
    expect(child1Mocks.onMount).toHaveBeenCalledTimes(1);
    expect(child1Mocks.onUnmount).toHaveBeenCalledTimes(0);
    expect(child1Mocks.onRender).toHaveBeenCalledTimes(3);
    // Child 2 lifecycle.
    expect(child2Mocks.onMount).toHaveBeenCalledTimes(1);
    expect(child2Mocks.onUnmount).toHaveBeenCalledTimes(0);
    expect(child2Mocks.onRender).toHaveBeenCalledTimes(3);
    // Child 3 lifecycle.
    expect(child3Mocks.onMount).toHaveBeenCalledTimes(1);
    expect(child3Mocks.onUnmount).toHaveBeenCalledTimes(0);
    expect(child3Mocks.onRender).toHaveBeenCalledTimes(4);
    // Child 4 lifecycle.
    expect(child4Mocks.onMount).toHaveBeenCalledTimes(1);
    expect(child4Mocks.onUnmount).toHaveBeenCalledTimes(0);
    expect(child4Mocks.onRender).toHaveBeenCalledTimes(4);
  });
});

describe('Reparenting and adding other children', () => {
  test('Without re-render', () => {
    parentA.send('1', parentB, 0);

    // Update the children.
    wrapperA.setProps({
      children: (
        <Parent parentRef={parentARef}>
          <Child key="2" {...child2Mocks} />
        </Parent>
      ),
    });
    wrapperB.setProps({
      children: (
        <Parent parentRef={parentBRef}>
          <Child key="A" id="A" />,
          <Child key="1" {...child1Mocks} />,
          <Child key="B" id="B" />,
          <Child key="3" {...child3Mocks} />,
          <Child key="4" {...child4Mocks} />,
        </Parent>
      ),
    });

    // The children are in the correct order.
    expect(
      Array.from(wrapperA.getDOMNode().children).map((child: HTMLElement) =>
        child.getAttribute('id')
      )
    ).toEqual(['2']);
    expect(
      Array.from(wrapperB.getDOMNode().children).map((child: HTMLElement) =>
        child.getAttribute('id')
      )
    ).toEqual(['A', '1', 'B', '3', '4']);
  });

  test('Rerender A and B before reparenting', () => {
    // Rerender.
    wrapperA.setProps({
      children: (
        <Parent parentRef={parentARef}>
          <Child key="1" {...child1Mocks} />,
          <Child key="2" {...child2Mocks} />,
        </Parent>
      ),
    });
    wrapperB.setProps({
      children: (
        <Parent parentRef={parentBRef}>
          <Child key="3" {...child3Mocks} />,
          <Child key="4" {...child4Mocks} />,
        </Parent>
      ),
    });

    parentA.send('1', parentB, 0);

    // Update the children.
    wrapperA.setProps({
      children: (
        <Parent parentRef={parentARef}>
          <Child key="2" {...child2Mocks} />
        </Parent>
      ),
    });
    wrapperB.setProps({
      children: (
        <Parent parentRef={parentBRef}>
          <Child key="A" id="A" />,
          <Child key="1" {...child1Mocks} />,
          <Child key="B" id="B" />,
          <Child key="3" {...child3Mocks} />,
          <Child key="4" {...child4Mocks} />,
        </Parent>
      ),
    });

    // The children are in the correct order.
    expect(
      Array.from(wrapperA.getDOMNode().children).map((child: HTMLElement) =>
        child.getAttribute('id')
      )
    ).toEqual(['2']);
    expect(
      Array.from(wrapperB.getDOMNode().children).map((child: HTMLElement) =>
        child.getAttribute('id')
      )
    ).toEqual(['A', '1', 'B', '3', '4']);
  });

  test('Rerender A and B before and after reparenting', () => {
    // Rerender.
    wrapperA.setProps({
      children: (
        <Parent parentRef={parentARef}>
          <Child key="1" {...child1Mocks} />,
          <Child key="2" {...child2Mocks} />,
        </Parent>
      ),
    });
    wrapperB.setProps({
      children: (
        <Parent parentRef={parentBRef}>
          <Child key="3" {...child3Mocks} />,
          <Child key="4" {...child4Mocks} />,
        </Parent>
      ),
    });

    parentA.send('1', parentB, 0);

    // Update the children.
    wrapperA.setProps({
      children: (
        <Parent parentRef={parentARef}>
          <Child key="2" {...child2Mocks} />
        </Parent>
      ),
    });
    wrapperB.setProps({
      children: (
        <Parent parentRef={parentBRef}>
          <Child key="A" id="A" />,
          <Child key="1" {...child1Mocks} />,
          <Child key="B" id="B" />,
          <Child key="3" {...child3Mocks} />,
          <Child key="4" {...child4Mocks} />,
        </Parent>
      ),
    });

    // Rerender.
    wrapperA.setProps({
      children: (
        <Parent parentRef={parentARef}>
          <Child key="2" {...child2Mocks} />
        </Parent>
      ),
    });
    wrapperB.setProps({
      children: (
        <Parent parentRef={parentBRef}>
          <Child key="A" id="A" />,
          <Child key="1" {...child1Mocks} />,
          <Child key="B" id="B" />,
          <Child key="3" {...child3Mocks} />,
          <Child key="4" {...child4Mocks} />,
        </Parent>
      ),
    });

    // The children are in the correct order.
    expect(
      Array.from(wrapperA.getDOMNode().children).map((child: HTMLElement) =>
        child.getAttribute('id')
      )
    ).toEqual(['2']);
    expect(
      Array.from(wrapperB.getDOMNode().children).map((child: HTMLElement) =>
        child.getAttribute('id')
      )
    ).toEqual(['A', '1', 'B', '3', '4']);
  });

  test('Rerender A before reparenting, rerender A and B after reparenting', () => {
    // Rerender.
    wrapperA.setProps({
      children: (
        <Parent parentRef={parentARef}>
          <Child key="1" {...child1Mocks} />,
          <Child key="2" {...child2Mocks} />,
        </Parent>
      ),
    });

    parentA.send('1', parentB, 0);

    // Update the children.
    wrapperA.setProps({
      children: (
        <Parent parentRef={parentARef}>
          <Child key="2" {...child2Mocks} />
        </Parent>
      ),
    });
    wrapperB.setProps({
      children: (
        <Parent parentRef={parentBRef}>
          <Child key="A" id="A" />,
          <Child key="1" {...child1Mocks} />,
          <Child key="B" id="B" />,
          <Child key="3" {...child3Mocks} />,
          <Child key="4" {...child4Mocks} />,
        </Parent>
      ),
    });

    // Rerender.
    wrapperA.setProps({
      children: (
        <Parent parentRef={parentARef}>
          <Child key="2" {...child2Mocks} />
        </Parent>
      ),
    });
    wrapperB.setProps({
      children: (
        <Parent parentRef={parentBRef}>
          <Child key="A" id="A" />,
          <Child key="1" {...child1Mocks} />,
          <Child key="B" id="B" />,
          <Child key="3" {...child3Mocks} />,
          <Child key="4" {...child4Mocks} />,
        </Parent>
      ),
    });

    // The children are in the correct order.
    expect(
      Array.from(wrapperA.getDOMNode().children).map((child: HTMLElement) =>
        child.getAttribute('id')
      )
    ).toEqual(['2']);
    expect(
      Array.from(wrapperB.getDOMNode().children).map((child: HTMLElement) =>
        child.getAttribute('id')
      )
    ).toEqual(['A', '1', 'B', '3', '4']);
  });

  test('Rerender B before reparenting, rerender A and B after reparenting', () => {
    // Rerender.
    wrapperB.setProps({
      children: (
        <Parent parentRef={parentBRef}>
          <Child key="3" {...child3Mocks} />,
          <Child key="4" {...child4Mocks} />,
        </Parent>
      ),
    });

    parentA.send('1', parentB, 0);

    // Update the children.
    wrapperA.setProps({
      children: (
        <Parent parentRef={parentARef}>
          <Child key="2" {...child2Mocks} />
        </Parent>
      ),
    });
    wrapperB.setProps({
      children: (
        <Parent parentRef={parentBRef}>
          <Child key="A" id="A" />,
          <Child key="1" {...child1Mocks} />,
          <Child key="B" id="B" />,
          <Child key="3" {...child3Mocks} />,
          <Child key="4" {...child4Mocks} />,
        </Parent>
      ),
    });

    // Rerender.
    wrapperA.setProps({
      children: (
        <Parent parentRef={parentARef}>
          <Child key="2" {...child2Mocks} />
        </Parent>
      ),
    });
    wrapperB.setProps({
      children: (
        <Parent parentRef={parentBRef}>
          <Child key="A" id="A" />,
          <Child key="1" {...child1Mocks} />,
          <Child key="B" id="B" />,
          <Child key="3" {...child3Mocks} />,
          <Child key="4" {...child4Mocks} />,
        </Parent>
      ),
    });

    // The children are in the correct order.
    expect(
      Array.from(wrapperA.getDOMNode().children).map((child: HTMLElement) =>
        child.getAttribute('id')
      )
    ).toEqual(['2']);
    expect(
      Array.from(wrapperB.getDOMNode().children).map((child: HTMLElement) =>
        child.getAttribute('id')
      )
    ).toEqual(['A', '1', 'B', '3', '4']);
  });
});

describe('Reparenting with context', () => {
  test('Without re-render', () => {
    const Context = createContext<string>('');
    let valueA: string;
    let valueB: string;

    wrapperA = mount(
      <Context.Provider value="A">
        <Parent parentRef={parentARef}>
          <Context.Consumer key="1">
            {(value): null => {
              valueA = value;
              return null;
            }}
          </Context.Consumer>
        </Parent>
      </Context.Provider>
    );

    wrapperB = mount(
      <Context.Provider value="B">
        <Parent parentRef={parentBRef}>
          <Context.Consumer key="2">
            {(value): null => {
              valueB = value;
              return null;
            }}
          </Context.Consumer>
        </Parent>
      </Context.Provider>
    );

    expect(valueA).toBe('A');
    expect(valueB).toBe('B');

    parentA.send(0, parentB, 0);

    wrapperB.setProps({
      children: (
        <Parent parentRef={parentBRef}>
          <Context.Consumer key="1">
            {(value): null => {
              valueA = value;
              return null;
            }}
          </Context.Consumer>
          <Context.Consumer key="2">
            {(value): null => {
              valueB = value;
              return null;
            }}
          </Context.Consumer>
        </Parent>
      ),
    });

    expect(valueA).toBe('B');
    expect(valueB).toBe('B');
  });
});
