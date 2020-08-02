import { Item } from '../../src/domain/item';
import { ItemHolder } from '../../src/domain/item-holder';
import { Proportions } from '../../src/domain/proportions';
import { Ingredients } from '../../src/domain/ingredients';

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
      itemHolder.removeItems(new Proportions('a'))
                     .equals(new Ingredients([['a', [item1]]]))
    ).toBeTruthy();

    expect(() => itemHolder.removeItems(new Proportions('a'))).toThrow('Missing item');

    itemHolder.addItems([item2, item3]);

    expect(itemHolder.removeItems(new Proportions(['a', 'b']))
                          .equals(new Ingredients([['a', [item2]], ['b', [item3]]]))
    ).toBeTruthy();

    itemHolder.addItems([item1, item2, item3, item4, item5]);

    expect(itemHolder.removeItems(new Proportions([['a', 2], ['b', 1], ['c', 2]]))
                          .equals(new Ingredients([['a', [item1, item2]], ['b', [item3]], ['c', [item4, item5]]]))
    ).toBeTruthy();

    expect(() => itemHolder.removeItems(new Proportions('b'))).toThrow('Missing item');

    expect(() => itemHolder.removeItems(new Proportions('c'))).toThrow('Missing item');
  });

  // test('getProportions()', () => {
  // });
});
