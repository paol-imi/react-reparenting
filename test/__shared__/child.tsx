import React, {Component} from 'react';

/**
 * Custom child component that accepts some lifecycle callback.
 */
export class Child extends Component<ChildProps> {
  constructor(props) {
    super(props);
    // eslint-disable-next-line react/no-unused-state
    this.state = {id: Math.random()};
  }

  componentDidMount() {
    const {onMount} = this.props;
    if (onMount) onMount();
  }

  componentWillUnmount() {
    const {onUnmount} = this.props;
    if (onUnmount) onUnmount();
  }

  render() {
    const {onRender, id} = this.props;
    if (onRender) onRender();
    return <div id={id} className="child" />;
  }
}

export type ChildProps = {
  id?: string;
  onRender?: () => void;
  onMount?: () => void;
  onUnmount?: () => void;
};
