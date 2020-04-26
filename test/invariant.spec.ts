import {invariant, Invariant} from '../src/invariant';

describe('How invariant works', () => {
  test('Warning', () => {
    expect(() => {
      invariant(true, 'invariant');
    }).not.toThrow();
  });

  test('Warning ', () => {
    expect(() => {
      invariant(false, 'invariant');
    }).toThrowError(new Invariant('Invariant failed: invariant'));
  });
});
