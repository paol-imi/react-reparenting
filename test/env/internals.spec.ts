import {Int} from '../../src';

describe('How internals keys works', () => {
  test('The Int instances contains the fiber keys related to the React version', () => {
    expect(typeof Int.componentAttribute).toBe('string');
    expect(typeof Int.nodePrefix).toBe('string');
  });
});
