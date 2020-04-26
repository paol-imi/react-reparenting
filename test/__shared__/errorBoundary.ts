import {Component} from 'react';
import type {ReactNode} from 'react';

// eslint-disable-next-line no-console
const error1 = console.error;
const noop = (): null => null;

// Custom error bundary component.
export class ErrorBoundary extends Component<
  {children: ReactNode},
  {error: Error | null}
> {
  constructor(props) {
    super(props);
    this.state = {error: null};
  }

  static getDerivedStateFromError(error): {error: Error} {
    // eslint-disable-next-line no-console
    console.error = error1;
    // Update state so the next render will show the fallback UI.
    return {error};
  }

  render(): ReactNode {
    // eslint-disable-next-line no-console
    console.error = noop;

    const {error} = this.state;
    if (error) return null;

    const {children} = this.props;
    return children;
  }
}
