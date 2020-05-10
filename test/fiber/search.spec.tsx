import React, {createRef} from 'react';
import {mount} from 'enzyme';
import {Env, getFiberFromElementInstance, searchFiber} from '../../src';

describe('How searchFiber( ) works', () => {
  test('Search the first DOM node in the ancestors', () => {
    const parentRef = createRef<HTMLDivElement>();
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
    const {stateNode} = searchFiber(
      fragmentFiber,
      (fiber) => fiber.return,
      (fiber) => Env.isElement(fiber.elementType, fiber.stateNode)
    );

    // The fiber is found.
    expect(stateNode).toBe(parentRef.current);
  });

  test('Not find the fiber', () => {
    const ref = createRef<HTMLDivElement>();
    mount(<div ref={ref} />);
    const elementFiber = getFiberFromElementInstance(ref.current).return;
    const fiberToSearch = searchFiber(
      elementFiber,
      (fiber) => fiber.return,
      () => false
    );

    // The fiber is not found.
    expect(fiberToSearch).toBe(null);
  });
});
