import React, {Component} from 'react';
import type {Fiber} from 'react-reconciler';
import {mount} from 'enzyme';
import type {ReactWrapper} from 'enzyme';
import {ErrorBoundary, warn} from '../__shared__';
import {Reparentable, ReparentableMap, useReparentable} from '../../src';
import {Invariant} from '../../src/invariant';

// Maps.
let map: ReparentableMap;
let fMap: ReparentableMap;
let cMap: ReparentableMap;
// Wrapper.
let wrapper: ReactWrapper;

// Consumer function component.
const ConsumerFunction = (): null => {
  fMap = useReparentable();
  return null;
};
// Consumer class component.
class ConsumerClass extends Component {
  static contextType = Reparentable.Context;
  render(): null {
    cMap = this.context;
    return null;
  }
}

beforeEach(() => {
  // Mount the components.
  wrapper = mount(
    <Reparentable.Provider
      reparentableMapRef={(rMap): void => {
        map = rMap;
      }}>
      {/* Consumers. */}
      <ConsumerFunction />
      <ConsumerClass />
      {/* Reparentables. */}
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
    </Reparentable.Provider>
  );

  // Clear the mock.
  warn.mockClear();
});

describe('How <Reparentable.Provider> works', () => {
  test('The map is provided', () => {
    // The map is found.
    expect(map).toBeInstanceOf(ReparentableMap);
    expect(map).toBe(fMap);
    expect(map).toBe(cMap);
    // Warning calls.
    expect(warn).not.toHaveBeenCalled();
  });

  test('Get a warning if rendering 2 <Reparentable> with the same id', () => {
    mount(
      <Reparentable.Provider>
        <Reparentable id="A">{null}</Reparentable>
        <Reparentable id="A">{null}</Reparentable>
      </Reparentable.Provider>
    );
    // Warning calls.
    expect(warn).toHaveBeenCalled();
  });
});

describe('How <Reparentable> works', () => {
  test('The ParentFiber instances are set in the Map', () => {
    // The instances are in the map.
    expect(map.has('A')).toBeTruthy();
    expect(map.has('B')).toBeTruthy();
    // The size is correct.
    expect(map.size).toBe(2);
    // Warning calls.
    expect(warn).not.toHaveBeenCalled();
  });

  test('The ParentFiber is initialized after mounting the component', () => {
    // The fiber is set.
    expect(map.get('A').fiber).not.toBe(null);
    expect(map.get('B').fiber).not.toBe(null);
    // Warning calls.
    expect(warn).not.toHaveBeenCalled();
  });

  test('The ParentFiber instances are deleted from the map after unmounting', () => {
    wrapper.unmount();
    // The size is correct.
    expect(map.size).toBe(0);
    // Warning calls.
    expect(warn).not.toHaveBeenCalled();
  });

  test('Send the child with the key "1" in the first position', () => {
    const {send} = map;
    // Send the child.
    const position = send('A', 'B', '1', 0);
    // The position is correct.
    expect(position).toBe(0);
    // Warning calls.
    expect(warn).not.toHaveBeenCalled();
  });

  test('Get a warning about wrong <Reparentable> id', () => {
    const {send} = map;
    // No <Reparentable> has id 'C'.
    const position = send('A', 'C', '1', 0);
    // The position is correct.
    expect(position).toBe(-1);
    // Warning calls.
    expect(warn).toHaveBeenCalled();
  });

  test('The findFiber prop', () => {
    mount(
      <Reparentable.Provider>
        <ConsumerFunction />
        <Reparentable id="A" findFiber={(fiber): Fiber => fiber.child}>
          <div key="1" />
        </Reparentable>
      </Reparentable.Provider>
    );

    // The correct fiber is set.
    expect(fMap.get('A').fiber.key).toBe('1');
    // Warning calls.
    expect(warn).not.toHaveBeenCalled();
  });

  test('<Reparentable> throw if <Reparentable.Provider> is not used', () => {
    wrapper = mount(
      <ErrorBoundary>
        <Reparentable id="A">{null}</Reparentable>
      </ErrorBoundary>
    );

    // The hook throw.
    expect((wrapper.state() as ErrorBoundary['state']).error).toBeInstanceOf(
      Invariant
    );

    // Warning calls.
    expect(warn).not.toHaveBeenCalled();
  });

  test('<Reparentable> throw if id is not passed', () => {
    wrapper = mount(
      <ErrorBoundary>
        <Reparentable id={null}>{null}</Reparentable>
      </ErrorBoundary>
    );

    // The hook throw.
    expect((wrapper.state() as ErrorBoundary['state']).error).toBeInstanceOf(
      Invariant
    );

    // Warning calls.
    expect(warn).not.toHaveBeenCalled();
  });
});

describe('How useReparentable( ) works', () => {
  test('useReparentable( ) throw if <Reparentable.Provider> is not used', () => {
    wrapper = mount(
      <ErrorBoundary>
        <ConsumerFunction />
      </ErrorBoundary>
    );

    // The hook throw.
    expect((wrapper.state() as ErrorBoundary['state']).error).toBeInstanceOf(
      Invariant
    );

    // Warning calls.
    expect(warn).not.toHaveBeenCalled();
  });
});

describe('How <Reparentable.Context> works', () => {
  test('Get a null context value if <Reparentable.Provider> is not used', () => {
    mount(<ConsumerClass />);
    // The context is null.
    expect(cMap).toBe(null);
    // Warning calls.
    expect(warn).not.toHaveBeenCalled();
  });
});
