import React, {Component} from 'react';
import type {ReactNode} from 'react';

/**
 * Custom child component that accepts some lifecycle callback.
 */
export class Child extends Component<ChildProps> {
  // eslint-disable-next-line react/no-unused-state, react/state-in-constructor
  state = {id: Math.random()};

  componentDidMount(): void {
    const {onMount} = this.props;
    onMount();
  }

  componentWillUnmount(): void {
    const {onUnmount} = this.props;
    onUnmount();
  }

  render(): ReactNode {
    const {id, onRender} = this.props;
    onRender();
    return <div id={id} className="child" />;
  }
}

export type ChildProps = {
  id: string;
  onRender: () => void;
  onMount: () => void;
  onUnmount: () => void;
};
