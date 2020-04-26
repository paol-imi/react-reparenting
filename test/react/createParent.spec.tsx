import React, {Component} from 'react';
import type {Fiber} from 'react-reconciler';
import type {ReactWrapper} from 'enzyme';
import {mount} from 'enzyme';
import {warn} from '../__shared__';
import {createParent, ParentFiber} from '../../src';

// Wrapper.
let wrapper: ReactWrapper;
// Parent fiber.
let parent: ParentFiber;

// Parent Component.
class Parent extends Component<{findFiber?: (fiber: Fiber) => Fiber}> {
  constructor(props) {
    super(props);
    const {findFiber} = this.props;
    parent = createParent(this, findFiber);
  }

  render(): null {
    return null;
  }
}

beforeEach(() => {
  // Mount the component.
  wrapper = mount(<Parent />);

  // Clear the mock.
  warn.mockClear();
});

describe('How createParent( ) works', () => {
  test('The method provide a ParentFiber instance', () => {
    // The ParentFiber instance is provided.
    expect(parent).toBeInstanceOf(ParentFiber);
    // Warning calls.
    expect(warn).not.toHaveBeenCalled();
  });

  test('The ParentFiber is initialized after mounting the component', () => {
    // The fiber is set.
    expect(parent.fiber).not.toBe(null);
    // Warning calls.
    expect(warn).not.toHaveBeenCalled();
  });

  test('The fiber reference is removed after unMount', () => {
    wrapper.unmount();
    // The fiber is removed.
    expect(parent.fiber).toBe(null);
    // Warning calls.
    expect(warn).not.toHaveBeenCalled();
  });

  test('The findFiber prop', () => {
    // Mount the component.
    mount(
      <>
        <div key="1">
          <Parent findFiber={(fiber): Fiber => fiber.return} />
        </div>
      </>
    );

    // The fiber is correct.
    expect(parent.fiber.key).toBe('1');
    // Warning calls.
    expect(warn).not.toHaveBeenCalled();
  });

  test('(With componentDidMount) The ParentFiber is initialized after mounting the component', () => {
    // Add lifecycle method.
    const cdm = (Parent.prototype.componentDidMount = jest.fn());

    // Mount the component.
    mount(<Parent />);
    // The fiber is set.
    expect(parent.fiber).not.toBe(null);
    // The lifecycle method is called.
    expect(cdm).toHaveBeenCalledTimes(1);

    // Remove lifecycle method.
    delete Parent.prototype.componentDidMount;
  });

  test('(With componentWillUnmount) The fiber reference is removed after unMount', () => {
    // Add lifecycle method.
    const cwu = (Parent.prototype.componentWillUnmount = jest.fn());

    // Mount and unmount the component.
    mount(<Parent />).unmount();
    // The fiber is removed.
    expect(parent.fiber).toBe(null);
    // The lifecycle method is called.
    expect(cwu).toHaveBeenCalledTimes(1);

    // Remove lifecycle method.
    delete Parent.prototype.componentWillUnmount;
  });

  test('The lifecycle methods are called', () => {
    // Add lifecycle methods.
    const cdm = (Parent.prototype.componentDidMount = jest.fn());
    const cwu = (Parent.prototype.componentWillUnmount = jest.fn());

    // Mount the component.
    wrapper = mount(<Parent />);
    // The lifecycle methods are called.
    expect(cdm).toHaveBeenCalledTimes(1);
    expect(cwu).toHaveBeenCalledTimes(0);

    // Unmount the component.
    wrapper.unmount();
    // The lifecycle methods are called.
    expect(cdm).toHaveBeenCalledTimes(1);
    expect(cwu).toHaveBeenCalledTimes(1);

    // Remove lifecycle method.
    delete Parent.prototype.componentDidMount;
    delete Parent.prototype.componentWillUnmount;
  });
});
