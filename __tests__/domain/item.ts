import { Item } from '../../src/domain/item';

describe('Item', () => {
  const kind = 'kind';
  const item1 = new Item(kind, 42, 10);
  const item2 = new Item(kind, 42, 10);

  test('equals()', () => {
    expect(item1.equals(item2)).toBeFalsy();
  });
});
