import React, {Component} from 'react';
import type {ReactNode} from 'react';

/**
 * Custom child component that accepts some lifecycle callback.
 */
export class Child extends Component<ChildProps> {
  // eslint-disable-next-line react/no-unused-state
  state = {id: Math.random()};

  componentDidMount(): void {
    // OnMount callback.
    const {onMount} = this.props;
    onMount();
  }

  componentWillUnmount(): void {
    // OnUnount callback.
    const {onUnmount} = this.props;
    onUnmount();
  }

  render(): ReactNode {
    // OnRender callback.
    const {id, onRender} = this.props;
    onRender();
    return <div id={id} className="child" />;
  }
}

/** Child props. */
export type ChildProps = {
  /** The id of the element. */
  id: string;
  /** Callbacks. */
  onRender: () => void;
  onMount: () => void;
  onUnmount: () => void;
};
