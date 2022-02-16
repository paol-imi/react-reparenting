import {invariant, Invariant} from '../src/invariant';

describe('How invariant works (development)', () => {
  test('Not throw Invariant', () => {
    expect(() => {
      invariant(true, 'invariant');
    }).not.toThrow();
  });

  test('Throw Invariant', () => {
    expect(() => {
      invariant(false, 'invariant');
    }).toThrowError(new Invariant('Invariant failed: invariant'));
  });
});

describe('How invariant works (production)', () => {
  test('Not throw Invariant', () => {
    (global as any).__DEV__ = false;
    expect(() => {
      invariant(true, 'invariant');
    }).not.toThrow();
    (global as any).__DEV__ = true;
  });

  test('Throw Invariant', () => {
    expect(() => {
      (global as any).__DEV__ = false;
      invariant(false, 'invariant');
    }).toThrowError(new Invariant('Invariant failed'));
    (global as any).__DEV__ = true;
  });
});
