import React, {createRef} from 'react';
import {mount} from 'enzyme';
import type {Fiber} from 'react-reconciler';
import {Env, getFiberFromPath} from '../../src';
import {Child, Parent} from '../__shared__';
import {invariant} from '../../src/invariant';

describe('How getFiberFromPath( ) works', () => {
  test('Get the first DOM node in the ancestors', () => {
    const parentRef = createRef<Fiber>();
    const childRef = createRef<Fiber>();
    mount(
      <Parent fiberRef={parentRef}>
        <>
          <>
            <Child fiberRef={childRef} />
          </>
        </>
      </Parent>
    );

    // (type fixing).
    invariant(childRef.current !== null);
    const fragmentFiber = childRef.current.return;

    // The stateNode definition does not exist yet.

    const {stateNode} = getFiberFromPath(
      fragmentFiber,
      (fiber) => fiber.return,
      (fiber) => Env.isElement(fiber.elementType, fiber.stateNode)
    ) as any;

    // (type fixing).
    invariant(parentRef.current !== null);
    // The fiber is found.
    expect(stateNode).toBe(parentRef.current.stateNode);
  });

  test('Not find the fiber', () => {
    const ref = createRef<Fiber>();
    mount(<Child fiberRef={ref} />);
    const fiberToSearch = getFiberFromPath(
      ref.current,
      (fiber) => fiber.return,
      () => false
    );

    // The fiber is not found.
    expect(fiberToSearch).toBe(null);
  });
});
