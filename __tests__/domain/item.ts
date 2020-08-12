import { Item } from '../../src/domain/item';

describe('Item', () => {
  const kind = 'kind';
  const item1 = new Item({kinds: kind, quantity: 42, quality: 10});
  const item2 = new Item({kinds: kind, quantity: 42, quality: 10});
  const item3 = new Item({kinds: [kind], quantity: 42, quality: 10});
  const item4 = new Item({kinds: kind, quantity: 41, quality: 10});
  const item5 = new Item({kinds: kind, quantity: 42, quality: 9});

  test('equals()', () => {
    expect(item1.equals(item2)).toBeTruthy();
    expect(item1.equals(item3)).toBeTruthy();
    expect(item1.equals(item4)).toBeFalsy();
    expect(item1.equals(item5)).toBeFalsy();
  });
});
