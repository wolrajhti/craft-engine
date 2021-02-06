import { Rect } from '../../src/domain/rect';

describe('Rect', () => {
  test('borderWith left', () => {
    // 111222
    // 111222
    // 111222
    const r1 = new Rect(0, 0, 3,3);
    const r2 = new Rect(3, 0, 3, 3);
    const bound = r1.borderWith(r2);
    expect(bound.length).toBe(3);
    expect(bound[0][0]).toBe(3);
    expect(bound[1][0]).toBe(3);
    expect(bound[2][0]).toBe(3);
    expect(bound[0][1]).toBe(0);
    expect(bound[1][1]).toBe(1);
    expect(bound[2][1]).toBe(2);
  });

  test('borderWith left 3->1', () => {
    // 1112
    // 111
    // 111
    const r1 = new Rect(0, 0, 3,3);
    const r2 = new Rect(3, 0, 1, 1);
    const bound = r1.borderWith(r2);
    expect(bound.length).toBe(1);
    expect(bound[0][0]).toBe(3);
    expect(bound[0][1]).toBe(0);
  });

  test('borderWith left 3_>1', () => {
    // 111
    // 111
    // 1112
    const r1 = new Rect(0, 0, 3,3);
    const r2 = new Rect(3, 2, 1, 1);
    const bound = r1.borderWith(r2);
    expect(bound.length).toBe(1);
    expect(bound[0][0]).toBe(3);
    expect(bound[0][1]).toBe(2);
  });

  test('borderWith bottom', () => {
    // 111
    // 111
    // 111
    // 222
    // 222
    // 222
    const r1 = new Rect(0, 0, 3,3);
    const r2 = new Rect(0, 3, 3, 3);
    const bound = r1.borderWith(r2);
    expect(bound.length).toBe(3);
    expect(bound[0][0]).toBe(2);
    expect(bound[1][0]).toBe(1);
    expect(bound[2][0]).toBe(0);
    expect(bound[0][1]).toBe(3);
    expect(bound[1][1]).toBe(3);
    expect(bound[2][1]).toBe(3);
  });

  test('borderWith bottom 3->1', () => {
    // 111
    // 111
    // 111
    //   2
    const r1 = new Rect(0, 0, 3,3);
    const r2 = new Rect(2, 3, 1, 1);
    const bound = r1.borderWith(r2);
    expect(bound.length).toBe(1);
    expect(bound[0][0]).toBe(2);
    expect(bound[0][1]).toBe(3);
  });

  test('borderWith bottom 3_>1', () => {
    // 111
    // 111
    // 111
    // 2  
    const r1 = new Rect(0, 0, 3,3);
    const r2 = new Rect(0, 3, 1, 1);
    const bound = r1.borderWith(r2);
    expect(bound.length).toBe(1);
    expect(bound[0][0]).toBe(0);
    expect(bound[0][1]).toBe(3);
  });

  test('borderWith right', () => {
    // 222111
    // 222111
    // 222111
    const r1 = new Rect(3, 0, 3,3);
    const r2 = new Rect(0, 0, 3, 3);
    const bound = r1.borderWith(r2);
    expect(bound.length).toBe(3);
    expect(bound[0][0]).toBe(2);
    expect(bound[1][0]).toBe(2);
    expect(bound[2][0]).toBe(2);
    expect(bound[0][1]).toBe(2);
    expect(bound[1][1]).toBe(1);
    expect(bound[2][1]).toBe(0);
  });

  test('borderWith right 3->1', () => {
    //  111
    //  111
    // 2111
    const r1 = new Rect(1, 0, 3,3);
    const r2 = new Rect(0, 2, 1, 1);
    const bound = r1.borderWith(r2);
    expect(bound.length).toBe(1);
    expect(bound[0][0]).toBe(0);
    expect(bound[0][1]).toBe(2);
  });

  test('borderWith right 3_>1', () => {
    // 2111
    //  111
    //  111
    const r1 = new Rect(1, 0, 3,3);
    const r2 = new Rect(0, 0, 1, 1);
    const bound = r1.borderWith(r2);
    expect(bound.length).toBe(1);
    expect(bound[0][0]).toBe(0);
    expect(bound[0][1]).toBe(0);
  });

  test('borderWith top', () => {
    // 222
    // 222
    // 222
    // 111
    // 111
    // 111
    const r1 = new Rect(0, 3, 3,3);
    const r2 = new Rect(0, 0, 3, 3);
    const bound = r1.borderWith(r2);
    expect(bound.length).toBe(3);
    expect(bound[0][0]).toBe(0);
    expect(bound[1][0]).toBe(1);
    expect(bound[2][0]).toBe(2);
    expect(bound[0][1]).toBe(2);
    expect(bound[1][1]).toBe(2);
    expect(bound[2][1]).toBe(2);
  });

  test('borderWith top 3->1', () => {
    // 2
    // 111
    // 111
    // 111
    const r1 = new Rect(0, 1, 3,3);
    const r2 = new Rect(0, 0, 1, 1);
    const bound = r1.borderWith(r2);
    expect(bound.length).toBe(1);
    expect(bound[0][0]).toBe(0);
    expect(bound[0][1]).toBe(0);
  });

  test('borderWith top 3_>1', () => {
    //   2
    // 111
    // 111
    // 111
    const r1 = new Rect(0, 1, 3,3);
    const r2 = new Rect(2, 0, 1, 1);
    const bound = r1.borderWith(r2);
    expect(bound.length).toBe(1);
    expect(bound[0][0]).toBe(2);
    expect(bound[0][1]).toBe(0);
  });
});
