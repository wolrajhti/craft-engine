import { Item } from '../../src/domain/item';

describe('Item', () => {
  const kind = 'kind';
  const item1 = new Item(kind, 42, 10);
  const item2 = new Item([kind], 42, 10);
  const item3 = new Item([kind], 42, 10);
  const item4 = new Item([kind], 41, 10);
  const item5 = new Item([kind], 42, 9);

  test('equals()', () => {
    expect(item1.equals(item2)).toBeTruthy();
    expect(item1.equals(item3)).toBeTruthy();
    expect(item1.equals(item4)).toBeFalsy();
    expect(item1.equals(item5)).toBeFalsy();
  });
});
