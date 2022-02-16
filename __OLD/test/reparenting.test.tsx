import React, {createRef, createContext, memo, useContext} from 'react';
import {mount} from 'enzyme';
import type {MutableRefObject} from 'react';
import type {Fiber} from 'react-reconciler';
import type {ReactWrapper} from 'enzyme';
import {Child, getFibersIndices, getFibersKeys} from './__shared__';
import {findChildFiber, ParentFiber, Parent} from '../src';
import {invariant} from '../src/invariant';
import type {ChildProps} from './__shared__';

// Refs.
const parentARef = createRef<ParentFiber>();
const parentBRef = createRef<ParentFiber>();
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
    stateRef: createRef(),
  };
  // Children moks.
  child2Mocks = {
    id: '2',
    onRender: jest.fn(),
    onMount: jest.fn(),
    onUnmount: jest.fn(),
    stateRef: createRef(),
  };
  // Children moks.
  child3Mocks = {
    id: '3',
    onRender: jest.fn(),
    onMount: jest.fn(),
    onUnmount: jest.fn(),
    stateRef: createRef(),
  };
  // Children moks.
  child4Mocks = {
    id: '4',
    onRender: jest.fn(),
    onMount: jest.fn(),
    onUnmount: jest.fn(),
    stateRef: createRef(),
  };

  // Mount the components.
  wrapperA = mount(
    <div>
      <Parent parentRef={parentARef}>
        <Child key="1" {...child1Mocks} />
        <Child key="2" {...child2Mocks} />
      </Parent>
    </div>
  );
  wrapperB = mount(
    <div>
      <Parent parentRef={parentBRef}>
        <Child key="3" {...child3Mocks} />
        <Child key="4" {...child4Mocks} />
      </Parent>
    </div>
  );

  // Parents.
  invariant(parentARef.current !== null && parentBRef.current !== null);
  parentA = parentARef.current;
  parentB = parentBRef.current;
});

describe('How the reparented child lifecycle works', () => {
  test('Send a child', () => {
    parentA.sendChild(parentB, '1', 0);

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
          <Child key="1" {...child1Mocks} />
          <Child key="3" {...child3Mocks} />
          <Child key="4" {...child4Mocks} />
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
});

describe('How the state is maintained after reparenting', () => {
  test('Send a child', () => {
    // The state is generated using Math.random().
    invariant(child1Mocks.stateRef !== undefined);
    const randomlyCalculatedState = child1Mocks.stateRef.current;

    // Send the child.
    parentA.sendChild(parentB, '1', 0);

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
          <Child key="1" {...child1Mocks} />
          <Child key="3" {...child3Mocks} />
          <Child key="4" {...child4Mocks} />
        </Parent>
      ),
    });

    // The state is manteined.
    expect(randomlyCalculatedState).toBe(child1Mocks.stateRef.current);
  });
});

describe('Reparenting with context', () => {
  test('The context is changed', () => {
    // The the Context Consumer and Provider.
    const Context = createContext<string>('');
    const {Provider} = Context;
    const Consumer = (props: {valueRef: MutableRefObject<string>}): null => {
      const {valueRef} = props;
      valueRef.current = useContext(Context);
      return null;
    };

    // Context values.
    const valueARef = createRef<string>() as MutableRefObject<string>;
    const valueBRef = createRef<string>() as MutableRefObject<string>;

    // Mount the components.
    wrapperA = mount(
      <div>
        <Provider value="A">
          <Parent parentRef={parentARef}>
            <Consumer key="1" valueRef={valueARef} />
          </Parent>
        </Provider>
      </div>
    );
    wrapperB = mount(
      <div>
        <Provider value="B">
          <Parent parentRef={parentBRef}>
            <Consumer key="2" valueRef={valueBRef} />
          </Parent>
        </Provider>
      </div>
    );

    expect(valueARef.current).toBe('A');
    expect(valueBRef.current).toBe('B');
    parentA.sendChild(parentB, 0, 0);

    // Update the children.
    wrapperB.setProps({
      children: (
        <Provider value="B">
          <Parent parentRef={parentBRef}>
            <Consumer key="1" valueRef={valueARef} />
            <Consumer key="2" valueRef={valueBRef} />
          </Parent>
        </Provider>
      ),
    });

    // The context is changed.
    expect(valueARef.current).toBe('B');
    expect(valueBRef.current).toBe('B');
  });

  test('The context is changed with memoization', () => {
    // The the Context Consumer and Provider.
    const Context = createContext<string>('');
    const {Provider} = Context;
    const MemoConsumer = memo(
      (props: {valueRef: MutableRefObject<string>}): null => {
        const {valueRef} = props;
        valueRef.current = useContext(Context);
        return null;
      }
    );

    // Context values.
    const valueARef = createRef<string>() as MutableRefObject<string>;
    const valueBRef = createRef<string>() as MutableRefObject<string>;

    // Mount the components.
    wrapperA = mount(
      <div>
        <Provider value="A">
          <Parent parentRef={parentARef}>
            <MemoConsumer key="1" valueRef={valueARef} />
          </Parent>
        </Provider>
      </div>
    );

    wrapperB = mount(
      <div>
        <Provider value="B">
          <Parent parentRef={parentBRef}>
            <MemoConsumer key="2" valueRef={valueBRef} />
          </Parent>
        </Provider>
      </div>
    );

    expect(valueARef.current).toBe('A');
    expect(valueBRef.current).toBe('B');
    parentA.sendChild(parentB, 0, 0);

    // Update the children.
    wrapperB.setProps({
      children: (
        <Provider value="B">
          <Parent parentRef={parentBRef}>
            <MemoConsumer key="1" valueRef={valueARef} />
            <MemoConsumer key="2" valueRef={valueBRef} />
          </Parent>
        </Provider>
      ),
    });

    // The context is changed.
    expect(valueARef.current).toBe('B');
    expect(valueBRef.current).toBe('B');
  });
});

describe('Reparenting with React.memo', () => {
  test('The Child is not re-rendered after reparenting', () => {
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

    const MemoChild = React.memo(Child);

    // Mount the components.
    wrapperA = mount(
      <div>
        <Parent parentRef={parentARef}>
          <MemoChild key="1" {...child1Mocks} />
          <MemoChild key="2" {...child2Mocks} />
        </Parent>
      </div>
    );
    wrapperB = mount(
      <div>
        <Parent parentRef={parentBRef}>
          <MemoChild key="3" {...child3Mocks} />
          <MemoChild key="4" {...child4Mocks} />
        </Parent>
      </div>
    );

    // (type fixing).
    invariant(parentARef.current !== null && parentBRef.current !== null);
    // Parents.
    parentA = parentARef.current;
    parentB = parentBRef.current;
    parentA.sendChild(parentB, '1', 0);

    // Mount the components.
    wrapperA.setProps({
      children: (
        <Parent parentRef={parentARef}>
          <MemoChild key="2" {...child2Mocks} />
        </Parent>
      ),
    });
    wrapperB.setProps({
      children: (
        <Parent parentRef={parentBRef}>
          <MemoChild key="1" {...child1Mocks} />
          <MemoChild key="3" {...child3Mocks} />
          <MemoChild key="4" {...child4Mocks} />
        </Parent>
      ),
    });

    // Child 1 lifecycle.
    expect(child1Mocks.onMount).toHaveBeenCalledTimes(1);
    expect(child1Mocks.onUnmount).toHaveBeenCalledTimes(0);
    expect(child1Mocks.onRender).toHaveBeenCalledTimes(1);
    // Child 2 lifecycle.
    expect(child2Mocks.onMount).toHaveBeenCalledTimes(1);
    expect(child2Mocks.onUnmount).toHaveBeenCalledTimes(0);
    expect(child2Mocks.onRender).toHaveBeenCalledTimes(1);
    // Child 3 lifecycle.
    expect(child3Mocks.onMount).toHaveBeenCalledTimes(1);
    expect(child3Mocks.onUnmount).toHaveBeenCalledTimes(0);
    expect(child3Mocks.onRender).toHaveBeenCalledTimes(1);
    // Child 4 lifecycle.
    expect(child4Mocks.onMount).toHaveBeenCalledTimes(1);
    expect(child4Mocks.onUnmount).toHaveBeenCalledTimes(0);
    expect(child4Mocks.onRender).toHaveBeenCalledTimes(1);
  });
});

describe('Some possible scenarios', () => {
  test('Re-render A before reparenting', () => {
    // Re-render.
    wrapperA.setProps({
      children: (
        <Parent parentRef={parentARef}>
          <Child key="1" {...child1Mocks} />
          <Child key="2" {...child2Mocks} />
        </Parent>
      ),
    });

    parentA.sendChild(parentB, '1', 0);
    parentA.sendChild(parentB, '2', '4');

    // Update the children.
    wrapperA.setProps({
      children: <Parent parentRef={parentARef}>{null}</Parent>,
    });
    wrapperB.setProps({
      children: (
        <Parent parentRef={parentBRef}>
          <Child key="1" {...child1Mocks} />
          <Child key="3" {...child3Mocks} />
          <Child key="2" {...child2Mocks} />
          <Child key="4" {...child4Mocks} />
        </Parent>
      ),
    });

    const fiber = findChildFiber(parentB.getCurrent(), '2');
    invariant(fiber !== null && fiber.alternate !== null);

    // The fiber fields are updated.
    expect(fiber.return).toBe(parentB.getCurrent());
    expect(fiber.alternate.return).toBe(parentB.getCurrent().alternate);

    // The indices are updated.
    expect(getFibersIndices(parentA.getCurrent())).toEqual([]);
    expect(getFibersIndices(parentB.getCurrent())).toEqual([0, 1, 2, 3]);
    expect(getFibersIndices(parentB.getCurrent().alternate as Fiber)).toEqual([
      0,
      1,
      2,
      3,
    ]);
    // The keys are in the correct order.
    expect(getFibersKeys(parentA.getCurrent())).toEqual([]);
    expect(getFibersKeys(parentB.getCurrent())).toEqual(['1', '3', '2', '4']);
    expect(getFibersKeys(parentB.getCurrent().alternate as Fiber)).toEqual([
      '1',
      '3',
      '2',
      '4',
    ]);

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
    ).toEqual(['1', '3', '2', '4']);

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

  test('Re-render A before reparenting, re-render A and B after reparenting', () => {
    // Re-render.
    wrapperA.setProps({
      children: (
        <Parent parentRef={parentARef}>
          <Child key="1" {...child1Mocks} />
          <Child key="2" {...child2Mocks} />
        </Parent>
      ),
    });

    parentA.sendChild(parentB, '1', 0);
    parentA.sendChild(parentB, '2', '4');

    // Update the children.
    wrapperA.setProps({
      children: <Parent parentRef={parentARef}>{null}</Parent>,
    });
    wrapperB.setProps({
      children: (
        <Parent parentRef={parentBRef}>
          <Child key="1" {...child1Mocks} />
          <Child key="3" {...child3Mocks} />
          <Child key="2" {...child2Mocks} />
          <Child key="4" {...child4Mocks} />
        </Parent>
      ),
    });

    // Re-render.
    wrapperA.setProps({
      children: <Parent parentRef={parentARef}>{null}</Parent>,
    });
    wrapperB.setProps({
      children: (
        <Parent parentRef={parentBRef}>
          <Child key="1" {...child1Mocks} />
          <Child key="3" {...child3Mocks} />
          <Child key="2" {...child2Mocks} />
          <Child key="4" {...child4Mocks} />
        </Parent>
      ),
    });

    const fiber = findChildFiber(parentB.getCurrent(), '2');
    invariant(fiber !== null && fiber.alternate !== null);

    // The fiber fields are updated.
    expect(fiber.return).toBe(parentB.getCurrent());
    expect(fiber.alternate.return).toBe(parentB.getCurrent().alternate);

    // The indices are updated.
    expect(getFibersIndices(parentA.getCurrent())).toEqual([]);
    expect(getFibersIndices(parentB.getCurrent())).toEqual([0, 1, 2, 3]);
    expect(getFibersIndices(parentB.getCurrent().alternate as Fiber)).toEqual([
      0,
      1,
      2,
      3,
    ]);
    // The keys are in the correct order.
    expect(getFibersKeys(parentA.getCurrent())).toEqual([]);
    expect(getFibersKeys(parentB.getCurrent())).toEqual(['1', '3', '2', '4']);
    expect(getFibersKeys(parentB.getCurrent().alternate as Fiber)).toEqual([
      '1',
      '3',
      '2',
      '4',
    ]);

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
    ).toEqual(['1', '3', '2', '4']);

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

  test('Re-render A before reparenting, add a new child', () => {
    const child5Mocks = {
      id: '5',
      onRender: jest.fn(),
      onMount: jest.fn(),
      onUnmount: jest.fn(),
    };

    // Re-render.
    wrapperA.setProps({
      children: (
        <Parent parentRef={parentARef}>
          <Child key="1" {...child1Mocks} />
          <Child key="2" {...child2Mocks} />
        </Parent>
      ),
    });

    parentA.sendChild(parentB, '1', 0);
    parentA.sendChild(parentB, '2', '4');

    // Update the children.
    wrapperA.setProps({
      children: <Parent parentRef={parentARef}>{null}</Parent>,
    });
    wrapperB.setProps({
      children: (
        <Parent parentRef={parentBRef}>
          <Child key="1" {...child1Mocks} />
          <Child key="3" {...child3Mocks} />
          <Child key="5" {...child5Mocks} />
          <Child key="2" {...child2Mocks} />
          <Child key="4" {...child4Mocks} />
        </Parent>
      ),
    });

    const fiber = findChildFiber(parentB.getCurrent(), '2');
    invariant(fiber !== null && fiber.alternate !== null);

    // The fiber fields are updated.
    expect(fiber.return).toBe(parentB.getCurrent());
    expect(fiber.alternate.return).toBe(parentB.getCurrent().alternate);

    // The indices are updated.
    expect(getFibersIndices(parentA.getCurrent())).toEqual([]);
    expect(getFibersIndices(parentB.getCurrent())).toEqual([0, 1, 2, 3, 4]);
    expect(getFibersIndices(parentB.getCurrent().alternate as Fiber)).toEqual([
      0,
      1,
      2,
      3,
    ]);
    // The keys are in the correct order.
    expect(getFibersKeys(parentA.getCurrent())).toEqual([]);
    expect(getFibersKeys(parentB.getCurrent())).toEqual([
      '1',
      '3',
      '5',
      '2',
      '4',
    ]);
    expect(getFibersKeys(parentB.getCurrent().alternate as Fiber)).toEqual([
      '1',
      '3',
      '2',
      '4',
    ]);

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
    ).toEqual(['1', '3', '5', '2', '4']);

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
    expect(child3Mocks.onRender).toHaveBeenCalledTimes(2);
    // Child 4 lifecycle.
    expect(child4Mocks.onMount).toHaveBeenCalledTimes(1);
    expect(child4Mocks.onUnmount).toHaveBeenCalledTimes(0);
    expect(child4Mocks.onRender).toHaveBeenCalledTimes(2);
    // Child 5 lifecycle.
    expect(child5Mocks.onMount).toHaveBeenCalledTimes(1);
    expect(child5Mocks.onUnmount).toHaveBeenCalledTimes(0);
    expect(child5Mocks.onRender).toHaveBeenCalledTimes(1);

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

  test('Re-render A before reparenting, re-render A and B after reparenting, add a new child', () => {
    const child5Mocks = {
      id: '5',
      onRender: jest.fn(),
      onMount: jest.fn(),
      onUnmount: jest.fn(),
    };

    // Re-render.
    wrapperA.setProps({
      children: (
        <Parent parentRef={parentARef}>
          <Child key="1" {...child1Mocks} />
          <Child key="2" {...child2Mocks} />
        </Parent>
      ),
    });

    parentA.sendChild(parentB, '1', 0);
    parentA.sendChild(parentB, '2', '4');

    // Update the children.
    wrapperA.setProps({
      children: <Parent parentRef={parentARef}>{null}</Parent>,
    });
    wrapperB.setProps({
      children: (
        <Parent parentRef={parentBRef}>
          <Child key="1" {...child1Mocks} />
          <Child key="3" {...child3Mocks} />
          <Child key="5" {...child5Mocks} />
          <Child key="2" {...child2Mocks} />
          <Child key="4" {...child4Mocks} />
        </Parent>
      ),
    });

    // Re-render.
    wrapperA.setProps({
      children: <Parent parentRef={parentARef}>{null}</Parent>,
    });
    wrapperB.setProps({
      children: (
        <Parent parentRef={parentBRef}>
          <Child key="1" {...child1Mocks} />
          <Child key="3" {...child3Mocks} />
          <Child key="5" {...child5Mocks} />
          <Child key="2" {...child2Mocks} />
          <Child key="4" {...child4Mocks} />
        </Parent>
      ),
    });

    const fiber = findChildFiber(parentB.getCurrent(), '2');
    invariant(fiber !== null && fiber.alternate !== null);

    // The fiber fields are updated.
    expect(fiber.return).toBe(parentB.getCurrent());
    expect(fiber.alternate.return).toBe(parentB.getCurrent().alternate);

    // The indices are updated.
    expect(getFibersIndices(parentA.getCurrent())).toEqual([]);
    expect(getFibersIndices(parentB.getCurrent())).toEqual([0, 1, 2, 3, 4]);
    expect(getFibersIndices(parentB.getCurrent().alternate as Fiber)).toEqual([
      0,
      1,
      2,
      3,
      4,
    ]);
    // The keys are in the correct order.
    expect(getFibersKeys(parentA.getCurrent())).toEqual([]);
    expect(getFibersKeys(parentB.getCurrent())).toEqual([
      '1',
      '3',
      '5',
      '2',
      '4',
    ]);
    expect(getFibersKeys(parentB.getCurrent().alternate as Fiber)).toEqual([
      '1',
      '3',
      '5',
      '2',
      '4',
    ]);

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
    ).toEqual(['1', '3', '5', '2', '4']);

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
    // Child 5 lifecycle.
    expect(child5Mocks.onMount).toHaveBeenCalledTimes(1);
    expect(child5Mocks.onUnmount).toHaveBeenCalledTimes(0);
    expect(child5Mocks.onRender).toHaveBeenCalledTimes(2);

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
