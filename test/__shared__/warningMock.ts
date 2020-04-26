import * as module from '../../src/warning';

// eslint-disable-next-line no-console
const consoleError = console.error;
// Noop function.
const noop = (): null => null;
const {warning} = module;

export const warn = jest.fn();
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
module.warning = (condition: true, message: string): void => {
  if (!condition) warn(`Warning: ${message}`);

  // eslint-disable-next-line no-console
  console.error = noop;
  warning(condition, message);
  // eslint-disable-next-line no-console
  console.error = consoleError;
};
