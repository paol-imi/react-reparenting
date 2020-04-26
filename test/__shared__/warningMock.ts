import * as module from '../../src/warning';

export const warn = jest.fn();
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
module.warning = (condition: true, message: string): void => {
  if (!condition) warn(`Warning: ${message}`);
};
