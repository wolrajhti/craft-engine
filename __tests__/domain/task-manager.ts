import { TaskManager } from '../../src/domain/task-manager';
import { ItemHolder } from '../../src/domain/item-holder';
import { Item } from '../../src/domain/item';
import { Recipe } from '../../src/domain/recipe';
import { Proportions } from '../../src/domain/proportions';
import { Source } from '../../src/domain/source';

describe('TaskManager', () => {
  const itemHolder1 = new ItemHolder();
  const itemHolder2 = new ItemHolder();
  const itemHolder3 = new ItemHolder();

  const taskManager = new TaskManager([itemHolder1, itemHolder2, itemHolder3], []);

  beforeEach(() => {
    itemHolder1.clear();
    itemHolder2.clear();
    itemHolder3.clear();
  });

  describe('getBestItemHoldersFor()', () => {
    test('2 items in 1 holder', () => {
      itemHolder1.addItems([new Item('a'), new Item('b')]);
      expect(taskManager.getBestItemHoldersFor(['a', 'b'])
                                       .equals(new Source([
                                         [itemHolder1, new Proportions(['a', 'b'])]
                                       ]))
      ).toBeTruthy();
    });

    test('2 items in 2 holders', () => {
      itemHolder1.addItem(new Item('a'));
      itemHolder2.addItem(new Item('b'));
      expect(taskManager.getBestItemHoldersFor(['a', 'b'])
                                       .equals(new Source([
                                         [itemHolder1, new Proportions('a')],
                                         [itemHolder2, new Proportions('b')]
                                       ]))
      ).toBeTruthy();
    });

    test('3 items in 2 holders', () => {
      itemHolder1.addItem(new Item('a'));
      itemHolder2.addItems([new Item('b'), new Item('c')]);
      expect(taskManager.getBestItemHoldersFor(['a', 'b', 'c'])
                                       .equals(new Source([
                                         [itemHolder1, new Proportions('a')],
                                         [itemHolder2, new Proportions(['b', 'c'])]
                                       ]))
      ).toBeTruthy();
    });

    test('3 items with 1 missing', () => {
      itemHolder1.addItem(new Item('a'));
      itemHolder2.addItem(new Item('b'));
      expect(taskManager.getBestItemHoldersFor(['a', 'b', 'c'])
                                       .equals(new Source([]))
      ).toBeTruthy();
    });
  });

  describe('execute()', () => {
    test('missing item', () => {
      const recipe = new Recipe(['a', 'b']);
      expect(() => taskManager.execute(
        recipe,
        new Source([[itemHolder1, new Proportions('a')]]),
        itemHolder1
      )).toThrow('Missing item');
    });

    test('2 inputs 1 output', () => {
      itemHolder1.addItems([new Item('a'), new Item('b')]);
      const recipe = new Recipe(['a', 'b'], 'c');
      expect(itemHolder1.getProportions().contains('c')).toBeFalsy();
      taskManager.execute(
        recipe,
        new Source([[itemHolder1, new Proportions(['a', 'b'])]]),
        itemHolder1
      );
      const proportions = itemHolder1.getProportions();
      expect(proportions.contains('a')).toBeFalsy();
      expect(proportions.contains('b')).toBeFalsy();
      expect(proportions.contains('c')).toBeTruthy();
      expect(proportions.contains([['c', 2]])).toBeFalsy();
    });
  });

  // describe('getBestTasksFor()', () => {
  //   test('', () => {

  //   });
  // });

});
