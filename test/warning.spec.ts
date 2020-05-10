import {warning} from '../src/warning';

describe('How warning works', () => {
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
