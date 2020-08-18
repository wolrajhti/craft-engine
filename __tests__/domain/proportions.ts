import { Proportions } from '../../src/domain/proportions';

describe('Proportions', () => {
  test('equals', () => {
    expect(new Proportions('a').equals([['a', 1], ['b', 0]])).toBeTruthy();
    expect(new Proportions(['a', 'b']).equals([])).toBeFalsy();
    expect(new Proportions([]).equals(['a', 'b'])).toBeFalsy();
  });

  test('getNorm()', () => {
    expect(new Proportions().getNorm()).toBe(0);
    expect(new Proportions('a').getNorm()).toBe(1);
    expect(new Proportions([['a', 2]]).getNorm()).toBe(2);
    expect(new Proportions(['a', 'b']).getNorm()).toBeCloseTo(Math.sqrt(2));
    expect(new Proportions([['a', 1], ['b', 1]]).getNorm()).toBeCloseTo(Math.sqrt(2));
  });

  test('contains', () => {
    expect(new Proportions().contains('a')).toBeFalsy();

    expect(new Proportions('a').contains('a')).toBeTruthy();
    expect(new Proportions(['a']).contains('a')).toBeTruthy();
    expect(new Proportions([['a', 1]]).contains('a')).toBeTruthy();
    expect(new Proportions([['a', 2]]).contains('a')).toBeTruthy();

    expect(new Proportions('b').contains('a')).toBeFalsy();
    expect(new Proportions(['b']).contains('a')).toBeFalsy();
    expect(new Proportions([['b', 1]]).contains('a')).toBeFalsy();
    expect(new Proportions([['b', 2]]).contains('a')).toBeFalsy();

    expect(new Proportions(['a', 'b']).contains('a')).toBeTruthy();
    expect(new Proportions([['a', 1], 'b']).contains(['a', 'b'])).toBeTruthy();
    expect(new Proportions(['a', ['b', 1], ['c', 1]]).contains(['a', ['c', 2]])).toBeFalsy();
    expect(new Proportions(['a', ['b', 1], ['c', 2]]).contains('a')).toBeTruthy();
  });

  test('getMissing()', () => {
    // expect(taskManager.getMissing([['a', 1]])).toStrictEqual([['a', 1]]);
    // itemHolder1.addItem(new Item('a'));
    // expect(taskManager.getMissing([['a', 1]])).toStrictEqual([['a', 0]]);
    // expect(taskManager.getMissing([['a', 1], ['b', 1]])).toStrictEqual([['a', 0], ['b', 1]]);
    // itemHolder1.addItem(new Item('b'));
    // expect(taskManager.getMissing([['a', 1], ['b', 1]])).toStrictEqual([['a', 0], ['b', 0]]);
    // expect(taskManager.getMissing([['a', 1], ['b', 1], ['c', 1]]))
    //   .toStrictEqual([['a', 0], ['b', 0], ['c', 1]]);
    // itemHolder1.addItem(new Item('c'));
    // expect(taskManager.getMissing([['a', 1], ['b', 1], ['c', 1]]))
    //   .toStrictEqual([['a', 0], ['b', 0], ['c', 0]]);
  });
});