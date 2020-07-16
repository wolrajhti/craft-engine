import { Item } from '../../src/domain/item';
import { ItemHolder } from '../../src/domain/item-holder';

describe('ItemHolder', () => {

  const itemHolder = new ItemHolder();
  const item1 = new Item('kind1');
  const item2 = new Item('kind1');
  const item3 = new Item('kind2');
  const item4 = new Item('kind3');
  const item5 = new Item('kind3');

  beforeEach(() => {
    itemHolder.clear();
  });

  test('addItems and removeItems', () => {
    expect(itemHolder.addItems(item1)).toBeUndefined();
    expect(itemHolder.removeItems(item1.getKind())).toStrictEqual([item1]);
    expect(() => itemHolder.removeItems(item1.getKind())).toThrow('Missing item');
    itemHolder.addItems(item2, item3);
    expect(itemHolder.removeItems(item2.getKind(), item3.getKind())).toStrictEqual([item2, item3]);
    itemHolder.addItems(item1, item2, item3, item4, item5);
    expect(itemHolder.removeItems(item4.getKind(), item2.getKind(), item1.getKind(), item3.getKind(), item5.getKind()))
      .toStrictEqual([item4, item2, item1, item3, item5]);
    expect(() => itemHolder.removeItems(item3.getKind())).toThrow('Missing item');
    expect(() => itemHolder.removeItems(item4.getKind())).toThrow('Missing item');
  });

  test('contains()', () => {
    expect(itemHolder.contains(item1.getKind(), item2.getKind())).toBeFalsy();
    expect(itemHolder.contains(item3.getKind(), item4.getKind())).toBeFalsy();
    itemHolder.addItems(item1, item2);
    expect(itemHolder.contains(item1.getKind(), item2.getKind())).toBeTruthy();
    expect(itemHolder.contains(item3.getKind(), item4.getKind())).toBeFalsy();
    itemHolder.addItems(item4, item5);
    expect(itemHolder.contains(item3.getKind(), item4.getKind())).toBeFalsy();
    expect(itemHolder.contains(item4.getKind())).toBeTruthy();
  });
});
