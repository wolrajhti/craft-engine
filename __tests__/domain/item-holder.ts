import { Item } from '../../src/domain/item';
import { ItemHolder } from '../../src/domain/item-holder';

describe('ItemHolder', () => {

  const itemHolder = new ItemHolder();
  const item1 = new Item('a', 4);
  const item2 = new Item('b', 2);
  const item3 = new Item('c', 2);

  beforeEach(() => {
    itemHolder.clear();
  });

  test('addItems and removeItems', () => {
    expect(itemHolder.addItem('a', item1)).toBeUndefined();
    expect(itemHolder.addItem('b', item2)).toBeUndefined();
    expect(itemHolder.addItems([['c', [item3]]])).toBeUndefined();

    expect(
      itemHolder.removeItems('a')
                     .equals([['a', [new Item('a')]]])
    ).toBeTruthy();

    expect(
      itemHolder.removeItems(['a', 'b'])
                     .equals([['a', [new Item('a')]], ['b', [new Item('b')]]])
    ).toBeTruthy();

    expect(itemHolder.removeItems([['a', 2], 'b', ['c', 2]])
                          .equals([
                            ['a', [new Item('a', 2)]],
                            ['b', [new Item('b')]],
                            ['c', [new Item('c', 2)]]
                          ])
    ).toBeTruthy();

    expect(() => itemHolder.removeItems('a')).toThrow('Missing item');

    expect(() => itemHolder.removeItems('b')).toThrow('Missing item');

    expect(() => itemHolder.removeItems('c')).toThrow('Missing item');
  });

  // test('getProportions()', () => {
  // });
});
