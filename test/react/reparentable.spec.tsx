import React from 'react';
import {mount} from 'enzyme';
import type {Fiber} from 'react-reconciler';
import type {ReactWrapper} from 'enzyme';
import {ErrorBoundary} from '../__shared__';
import {createReparentableSpace} from '../../src';
import {invariant, Invariant} from '../../src/invariant';
import {warning} from '../../src/warning';

// Wrapper.
let wrapper: ReactWrapper;

const {
  Reparentable,
  ReparentableMap,
  sendReparentableChild,
} = createReparentableSpace();

beforeEach(() => {
  ReparentableMap.clear();

  // Mount the components.
  wrapper = mount(
    <div>
      <Reparentable id="A">
        <div key="1" />
        <div key="2" />
      </Reparentable>
      <Reparentable id="B">
        <div key="3" />
        <div key="4" />
      </Reparentable>
    </div>
  );

  // Clear the mock.
  (warning as jest.Mock).mockClear();
});

describe('How <Reparentable> works', () => {
  test('The ParentFiber instances are set in the Map', () => {
    // The instances are in the ReparentableMap.
    expect(ReparentableMap.has('A')).toBeTruthy();
    expect(ReparentableMap.has('B')).toBeTruthy();
    // The size is correct.
    expect(ReparentableMap.size).toBe(2);
    // Warning calls.
    expect(warning).not.toHaveBeenCalled();
  });

  test('The ParentFiber is initialized after mounting the component', () => {
    // The fiber is set.
    expect((ReparentableMap.get('A') as any).fiber).not.toBe(null);
    expect((ReparentableMap.get('B') as any).fiber).not.toBe(null);
    // Warning calls.
    expect(warning).not.toHaveBeenCalled();
  });

  test('The ParentFiber instances are deleted from the ReparentableMap after unmounting', () => {
    wrapper.unmount();
    // The size is correct.
    expect(ReparentableMap.size).toBe(0);
    // Warning calls.
    expect(warning).not.toHaveBeenCalled();
  });

  test('The findFiber prop', () => {
    mount(
      <Reparentable
        id="C"
        findFiber={(fiber) => {
          // (type fixing).
          invariant(fiber.child !== null);
          return fiber.child;
        }}>
        <div key="1" />
      </Reparentable>
    );

    // The correct fiber is set.
    expect((ReparentableMap.get('C') as any).getCurrent().key).toBe('1');
    // Warning calls.
    expect(warning).not.toHaveBeenCalled();
  });

  test('The findFiber prop is updated', () => {
    wrapper = mount(
      <Reparentable id="C">
        <div key="1" />
      </Reparentable>
    );

    wrapper.setProps({
      findFiber: (fiber: Fiber) => fiber.child,
    });

    // The correct fiber is set.
    expect((ReparentableMap.get('C') as any).findFiber).toBeDefined();
    // Warning calls.
    expect(warning).not.toHaveBeenCalled();
  });

  test('Get a warning if the same id is reused', () => {
    wrapper = mount(<Reparentable id="A">{null}</Reparentable>);
    // Warning calls.
    expect(warning).toHaveBeenCalledTimes(1);
  });

  test('<Reparentable> throw if id is not passed', () => {
    wrapper = mount(
      <ErrorBoundary>
        <Reparentable id={null as any}>{null}</Reparentable>
      </ErrorBoundary>
    );

    // The hook throw.
    expect((wrapper.state() as ErrorBoundary['state']).error).toBeInstanceOf(
      Invariant
    );

    // Warning calls.
    expect(warning).not.toHaveBeenCalled();
  });
});

describe('How sendReparentableChild works', () => {
  test('Send the child with the key "1" in the first position', () => {
    // Send the child.
    const position = sendReparentableChild('A', 'B', '1', 0);
    // The position is correct.
    expect(position).toBe(0);
    // Warning calls.
    expect(warning).not.toHaveBeenCalled();
  });

  test('Get a warning about wrong <Reparentable> id', () => {
    // No <Reparentable> has id 'C'.
    const position = sendReparentableChild('C', 'D', '1', 0);
    // The position is correct.
    expect(position).toBe(-1);
    // Warning calls.
    expect(warning).toHaveBeenCalledTimes(2);
  });
});
