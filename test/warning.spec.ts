import {warn} from './__shared__';
import {warning} from '../src/warning';

beforeEach(() => {
  // Clear the mock.
  warn.mockClear();
});

describe('How warning works', () => {
  test('Warning', () => {
    warning(true, 'warning');
    // Warning calls.
    expect(warn).not.toHaveBeenCalled();
  });

  test('Warning ', () => {
    warning(false, 'warning');
    // Warning calls.
    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn).toHaveBeenCalledWith('Warning: warning');
  });
});
