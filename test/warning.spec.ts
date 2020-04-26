import {warn} from './__shared__';
import {warning} from '../src/warning';

beforeEach(() => {
  // Clear the mock.
  warn.mockClear();
});

describe('How warning works', () => {
  test('Not log a warning', () => {
    warning(true, 'warning');
    // Warning calls.
    expect(warn).not.toHaveBeenCalled();
  });

  test('Log a warning', () => {
    warning(false, 'warning');
    // Warning calls.
    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn).toHaveBeenCalledWith('Warning: warning');
  });
});
