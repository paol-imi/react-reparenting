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
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    (global as any).__DEV__ = false;
    expect(() => {
      invariant(true, 'invariant');
    }).not.toThrow();
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    (global as any).__DEV__ = true;
  });

  test('Throw Invariant', () => {
    expect(() => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      (global as any).__DEV__ = false;
      invariant(false, 'invariant');
    }).toThrowError(new Invariant('Invariant failed'));
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    (global as any).__DEV__ = true;
  });
});
