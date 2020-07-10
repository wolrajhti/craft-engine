import { ItemFake } from './helpers/item.fake';
import { ItemHolderFake } from './helpers/item-holder.fake';

describe('ItemHolder', () => {

  const itemHolder = new ItemHolderFake();
  const item1 = new ItemFake('kind1');
  const item2 = new ItemFake('kind1');
  const item3 = new ItemFake('kind2');
  const item4 = new ItemFake('kind3');
  const item5 = new ItemFake('kind3');

  beforeEach(() => {
    itemHolder.clear();
  });

  test('addItems and removeItems', () => {
    expect(itemHolder.addItems(item1)).toBeUndefined();
    expect(itemHolder.removeItems(item1.kind)).toStrictEqual([item1]);
    expect(() => itemHolder.removeItems(item1.kind)).toThrow('Missing item');
    itemHolder.addItems(item2, item3);
    expect(itemHolder.removeItems(item2.kind, item3.kind)).toStrictEqual([item2, item3]);
    itemHolder.addItems(item1, item2, item3, item4, item5);
    expect(itemHolder.removeItems(item4.kind, item2.kind, item1.kind, item3.kind, item5.kind))
      .toStrictEqual([item4, item2, item1, item3, item5]);
    expect(() => itemHolder.removeItems(item3.kind)).toThrow('Missing item');
    expect(() => itemHolder.removeItems(item4.kind)).toThrow('Missing item');
  });

  test('contains', () => {
    expect(itemHolder.contains(item1.kind, item2.kind)).toBeFalsy();
    expect(itemHolder.contains(item3.kind, item4.kind)).toBeFalsy();
    itemHolder.addItems(item1, item2);
    expect(itemHolder.contains(item1.kind, item2.kind)).toBeTruthy();
    expect(itemHolder.contains(item3.kind, item4.kind)).toBeFalsy();
    itemHolder.addItems(item4, item5);
    expect(itemHolder.contains(item3.kind, item4.kind)).toBeFalsy();
    expect(itemHolder.contains(item4.kind)).toBeTruthy();
  });
});
