import React, {createRef} from 'react';
import type {Fiber} from 'react-reconciler';
import {mount} from 'enzyme';
import {warn} from '../__shared__';
import {
  ENV,
  getFiberFromElementInstance,
  findChildFiberAt,
  findChildFiber,
  findPreviousFiber,
  findContainerInstanceFiber,
  findInstanceFiber,
} from '../../src';

// Ref.
const parentRef = createRef<HTMLDivElement>();
// Fiber.
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

describe('How findChildFiberAt( ) works', () => {
  test('Find the first child fiber', () => {
    const fiber = findChildFiberAt(parentFiber, 0);
    // The fiber is found.
    expect(fiber).not.toBe(null);
    // The key is correct.
    expect(fiber.key).toBe('1');
    // Warning calls.
    expect(warn).not.toHaveBeenCalled();
  });

  test('Find the second (last) child fiber', () => {
    const fiber = findChildFiberAt(parentFiber, 1);
    // The fiber is found.
    expect(fiber).not.toBe(null);
    // The key is correct.
    expect(fiber.key).toBe('2');
    // Warning calls.
    expect(warn).not.toHaveBeenCalled();
  });

  test('Find the last child fiber', () => {
    const fiber = findChildFiberAt(parentFiber, -1);
    // The fiber is found.
    expect(fiber).not.toBe(null);
    // The key is correct.
    expect(fiber.key).toBe('2');
    // Warning calls.
    expect(warn).not.toHaveBeenCalled();
  });

  test('(Provide a position bigger than the number of children) Not find the fiber and get null', () => {
    const fiber = findChildFiberAt(parentFiber, 5);
    // The fiber is not found.
    expect(fiber).toBe(null);
    // Warning calls.
    expect(warn).toHaveBeenCalled();
  });

  test('(Parent without children) (Provide a position bigger than 0) Not find the fiber and get null', () => {
    // Setup.
    mount(<div ref={parentRef} />);
    parentFiber = getFiberFromElementInstance(parentRef.current);

    const fiber = findChildFiberAt(parentFiber, 1);
    // The fiber is not found.
    expect(fiber).toBe(null);
    // Warning calls.
    expect(warn).toHaveBeenCalled();
  });
});

describe('How findChildFiber( ) works', () => {
  test('Find the fiber with key "1"', () => {
    const fiber = findChildFiber(parentFiber, '1');
    // The fiber is found.
    expect(fiber).not.toBe(null);
    // The key is correct.
    expect(fiber.key).toBe('1');
    // Warning calls.
    expect(warn).not.toHaveBeenCalled();
  });

  test('Find the fiber with key "2"', () => {
    const fiber = findChildFiber(parentFiber, '2');
    // The fiber is found.
    expect(fiber).not.toBe(null);
    // The key is correct.
    expect(fiber.key).toBe('2');
    // Warning calls.
    expect(warn).not.toHaveBeenCalled();
  });

  test('(Provide a not valid key) Not find the fiber and get null', () => {
    const fiber = findChildFiber(parentFiber, '3');
    // The fiber is not found.
    expect(fiber).toBe(null);
    // Warning calls.
    expect(warn).toHaveBeenCalled();
  });

  test('(Parent without children) (Provide a not valid key) Not find the fiber and get null', () => {
    // Setup.
    mount(<div ref={parentRef} />);
    parentFiber = getFiberFromElementInstance(parentRef.current);

    const fiber = findChildFiber(parentFiber, '1');
    // The fiber is not found.
    expect(fiber).toBe(null);
    // Warning calls.
    expect(warn).toHaveBeenCalled();
  });
});

describe('How findPreviousFiber( ) works', () => {
  test('Find the fiber previous the one with key "2"', () => {
    const fiber = findPreviousFiber(parentFiber, '2');
    // The fiber is found.
    expect(fiber).not.toBe(null);
    // The key is correct.
    expect(fiber.key).toBe('1');
    // Warning calls.
    expect(warn).not.toHaveBeenCalled();
  });

  test('Find the fiber previous the first child and get the parent', () => {
    const fiber = findPreviousFiber(parentFiber, '1');
    // The fiber is found.
    expect(fiber).toBe(parentFiber);
    // Warning calls.
    expect(warn).not.toHaveBeenCalled();
  });

  test('(Provide a not valid key) Not find the fiber and get null', () => {
    const fiber = findPreviousFiber(parentFiber, '3');
    // The fiber is not found.
    expect(fiber).toBe(null);
    // Warning calls.
    expect(warn).toHaveBeenCalled();
  });

  test('(Parent without children) (Provide a not valid key) Not find the fiber and get null', () => {
    // Setup.
    mount(<div ref={parentRef} />);
    parentFiber = getFiberFromElementInstance(parentRef.current);

    const fiber = findPreviousFiber(parentFiber, '1');
    // The fiber is not found.
    expect(fiber).toBe(null);
    // Warning calls.
    expect(warn).toHaveBeenCalled();
  });
});

describe('How findContainerInstanceFiber( ) works', () => {
  test('Find the first DOM node in the parents', () => {
    // Setup.
    const childRef = createRef<HTMLDivElement>();
    mount(
      <div ref={parentRef}>
        <>
          <>
            <div ref={childRef} />
          </>
        </>
      </div>
    );

    const fragmentFiber = getFiberFromElementInstance(childRef.current).return;
    const {stateNode} = findContainerInstanceFiber(
      fragmentFiber,
      ENV.isElement
    );
    // The stateNode is found.
    expect(stateNode).toBe(parentRef.current);
  });
});

describe('How findInstanceFiber( ) works', () => {
  test('Find the first DOM node in the descendants', () => {
    // Setup.
    const childRef = createRef<HTMLDivElement>();
    mount(
      <div ref={parentRef}>
        <>
          <>
            <div ref={childRef} />
          </>
        </>
      </div>
    );

    const fragmentFiber = getFiberFromElementInstance(parentRef.current).child;
    const {stateNode} = findInstanceFiber<Element>(
      fragmentFiber,
      ENV.isElement
    );
    // The stateNode is found.
    expect(stateNode).toBe(childRef.current);
  });

  test('Warning if the child structure is ambiguous', () => {
    // Setup.
    const childRef = createRef<HTMLDivElement>();
    mount(
      <div ref={parentRef}>
        <>
          <>
            <>
              <div ref={childRef} />
            </>
            <>
              <div />
            </>
          </>
        </>
      </div>
    );

    const fragmentFiber = getFiberFromElementInstance(parentRef.current).child;
    const {stateNode} = findInstanceFiber(fragmentFiber, ENV.isElement);
    expect(stateNode).toBe(childRef.current);
    // Warning calls.
    expect(warn).toHaveBeenCalled();
  });
});
