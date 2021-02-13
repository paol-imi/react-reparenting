import React, {createRef} from 'react';
import {mount} from 'enzyme';
import type {ReactWrapper} from 'enzyme';
import {ErrorBoundary} from '../__shared__';
import {Parent, ParentFiber} from '../../src';
import {invariant, Invariant} from '../../src/invariant';

// Ref.
const parentRef = createRef<ParentFiber>();
// Wrapper.
let wrapper: ReactWrapper;
// Parent fiber.
let parent: ParentFiber;

beforeEach(() => {
  // Mount the component.
  wrapper = mount(
    <Parent parentRef={parentRef}>
      <div key="1" />
      <div key="2" />
    </Parent>
  );

  // (type fixing).
  invariant(parentRef.current !== null);
  parent = parentRef.current;
});

describe('How <Parent> works', () => {
  test('The component provide a ParentFiber instance', () => {
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
    mount(
      <Parent parentRef={parentRef} findFiber={(fiber) => fiber.child as any}>
        <div key="1" />
      </Parent>
    );
    // The correct fiber is set.
    invariant(parentRef.current !== null);
    expect(parentRef.current.getCurrent().key).toBe('1');
  });

  test('Pass a function as parentRef', () => {
    mount(
      <Parent
        parentRef={(ref) => {
          parent = ref as any;
        }}>
        <div key="1" />
      </Parent>
    );
    // The ParentFiber instance is provided.
    expect(parent).toBeInstanceOf(ParentFiber);
  });

  test('Throw if parentRef is not passed', () => {
    wrapper = mount(
      <ErrorBoundary>
        <Parent parentRef={null}>
          <div key="1" />
        </Parent>
      </ErrorBoundary>
    );
    // The hook throw.
    expect((wrapper.state() as ErrorBoundary['state']).error).toBeInstanceOf(
      Invariant
    );
  });
});
