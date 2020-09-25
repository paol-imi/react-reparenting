import {Component} from 'react';
import type {ReactNode} from 'react';

// eslint-disable-next-line no-console
const consoleError = console.error;
const noop = (): null => null;

// Custom error bundary component.
export class ErrorBoundary extends Component<
  {children: ReactNode},
  {error: Error | null}
> {
  /** State. */
  state = {error: null};

  static getDerivedStateFromError(error: Error): {error: Error} {
    // eslint-disable-next-line no-console
    console.error = consoleError;
    // Update state so the next render will show the fallback UI.
    return {error};
  }

  render(): ReactNode {
    // Remove the console to avoid the error logs.
    // eslint-disable-next-line no-console
    console.error = noop;

    const {error} = this.state;
    if (error) return null;

    const {children} = this.props;
    return children;
  }
}
