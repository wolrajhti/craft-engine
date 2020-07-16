import { Item } from '../../src/domain/item';

describe('Item', () => {
  const kind = 'kind';
  const item = new Item(kind);

  test('getKind()', () => {
    expect(item.getKind()).toStrictEqual(kind);
  });
});
