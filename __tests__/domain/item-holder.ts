import { Item } from '../../src/domain/item';
import { ItemHolder } from '../../src/domain/item-holder';

describe('ItemHolder', () => {

  const itemHolder = new ItemHolder();
  const item1 = new Item('a');
  const item2 = new Item('a');
  const item3 = new Item('b');
  const item4 = new Item('c');
  const item5 = new Item('c');

  beforeEach(() => {
    itemHolder.clear();
  });

  test('addItems and removeItems', () => {
    expect(itemHolder.addItem(item1)).toBeUndefined();

    expect(
      itemHolder.removeItems('a')
                     .equals([['a', [item1]]])
    ).toBeTruthy();

    expect(() => itemHolder.removeItems('a')).toThrow('Missing item');

    itemHolder.addItems([item2, item3]);

    expect(itemHolder.removeItems(['a', 'b'])
                          .equals([['a', [item2]], ['b', [item3]]])
    ).toBeTruthy();

    itemHolder.addItems([item1, item2, item3, item4, item5]);

    expect(itemHolder.removeItems([['a', 2], ['b', 1], ['c', 2]])
                          .equals([['a', [item1, item2]], ['b', [item3]], ['c', [item4, item5]]])
    ).toBeTruthy();

    expect(() => itemHolder.removeItems('b')).toThrow('Missing item');

    expect(() => itemHolder.removeItems('c')).toThrow('Missing item');
  });

  // test('getProportions()', () => {
  // });
});
