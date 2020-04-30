import {warn} from './__shared__';
import {warning} from '../src/warning';

beforeEach(() => {
  // Clear the mock.
  warn.mockClear();
});

describe('How warning works', () => {
  test('Log a warning', () => {
    warning('warning');
    // Warning calls.
    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn).toHaveBeenCalledWith('Warning: warning');
  });

  test('Not throw in IE9', () => {
    // Remove the console.
    const cnl = global.console;
    global.console = undefined;

    expect(() => {
      warning('warning');
    }).not.toThrow();

    global.console = cnl;
  });
});
