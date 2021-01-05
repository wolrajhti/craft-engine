import { Kind } from '../../src/domain/valueObjects/kind';

describe('Kind', () => {
  const A = new Kind('A');
  const A1 = new Kind('A1', A);
  const A11 = new Kind('A11', A1);

  test('is()', () => {
    expect(A.is(A)).toBeTruthy();
    expect(A1.is(A1)).toBeTruthy();
    expect(A11.is(A11)).toBeTruthy();
    expect(A1.is(A)).toBeTruthy();
    expect(A11.is(A)).toBeTruthy();
    expect(A11.is(A1)).toBeTruthy();
    expect(A.is(A1)).toBeFalsy();
    expect(A.is(A11)).toBeFalsy();
    expect(A1.is(A11)).toBeFalsy();
  });
});
