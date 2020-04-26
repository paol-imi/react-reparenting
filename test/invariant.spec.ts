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
    process.env.NODE_ENV = 'production';
    expect(() => {
      invariant(true, 'invariant');
    }).not.toThrow();
    process.env.NODE_ENV = 'development';
  });

  test('Throw Invariant', () => {
    expect(() => {
      process.env.NODE_ENV = 'production';
      invariant(false, 'invariant');
    }).toThrowError(new Invariant('Invariant failed'));
    process.env.NODE_ENV = 'development';
  });
});
