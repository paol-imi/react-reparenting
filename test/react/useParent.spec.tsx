import React from 'react';
import {mount} from 'enzyme';
import type {Fiber} from 'react-reconciler';
import type {ReactWrapper} from 'enzyme';
import {ErrorBoundary} from '../__shared__';
import {useParent, ParentFiber} from '../../src';
import {Invariant} from '../../src/invariant';

// Wrapper.
let wrapper: ReactWrapper;
// Parent fiber.
let parent: ParentFiber;

// Parent component.
const Parent = ({findFiber}: {findFiber?: (fiber: Fiber) => Fiber}): any => {
  const [parentFiber, ref] = useParent<HTMLDivElement>(findFiber);
  parent = parentFiber;
  return <div ref={ref} />;
};

beforeEach(() => {
  // Mount the component.
  wrapper = mount(<Parent />);
});

describe('How useParent( ) works', () => {
  test('The hook provide a ParentFiber instance', () => {
    // The ParentFiber instance is provided.
    expect(parent).toBeInstanceOf(ParentFiber);
  });

  test('The ParentFiber is initialized after mounting the component', () => {
    // The fiber is set.
    expect(parent.fiber).not.toBe(null);
  });

  test('The fiber reference is removed after unMount', () => {
    wrapper.unmount();
    // The fiber is removed.
    expect(parent.fiber).toBe(null);
  });

  test('The findFiber prop', () => {
    mount(<Parent findFiber={(fiber): Fiber => fiber.return} />);
    // The correct fiber is set.
    expect(parent.getCurrent().elementType).toBe(Parent);
  });

  test('Throw if the ref is not set', () => {
    const WrongParent = (): null => {
      useParent();
      return null;
    };

    wrapper = mount(
      <ErrorBoundary>
        <WrongParent />
      </ErrorBoundary>
    );
    // The hook throw.
    expect((wrapper.state() as ErrorBoundary['state']).error).toBeInstanceOf(
      Invariant
    );
  });

  test('The parent is the same after a re-render', () => {
    const currentParent = parent;
    wrapper.setProps({});
    // The hook throw.
    expect(currentParent).toBe(parent);
  });
});
