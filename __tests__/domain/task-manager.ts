import { TaskManager } from '../../src/domain/task-manager';
import { ItemHolder } from '../../src/domain/item-holder';
import { Item } from '../../src/domain/item';
import { Recipe } from '../../src/domain/recipe';

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
      itemHolder1.addItems([['a', [new Item('a')]], ['b', [new Item('b')]]]);
      expect(taskManager.getBestItemHoldersFor(['a', 'b'])
                                       .equals([
                                         [itemHolder1, ['a', 'b']]
                                       ])
      ).toBeTruthy();
    });

    test('2 items in 2 holders', () => {
      itemHolder1.addItem('a', new Item('a'));
      itemHolder2.addItem('b', new Item('b'));
      expect(taskManager.getBestItemHoldersFor(['a', 'b'])
                                       .equals([
                                         [itemHolder1, 'a'],
                                         [itemHolder2, 'b']
                                       ])
      ).toBeTruthy();
    });

    test('3 items in 2 holders', () => {
      itemHolder1.addItem('a', new Item('a'));
      itemHolder2.addItems([['b', [new Item('b')]], ['c', [new Item('c')]]]);
      expect(taskManager.getBestItemHoldersFor(['a', 'b', 'c'])
                                       .equals([
                                         [itemHolder1, 'a'],
                                         [itemHolder2, ['b', 'c']]
                                       ])
      ).toBeTruthy();
    });

    test('3 items with 1 missing', () => {
      itemHolder1.addItem('a', new Item('a'));
      itemHolder2.addItem('b', new Item('b'));
      expect(taskManager.getBestItemHoldersFor(['a', 'b', 'c'])
                                       .equals([])
      ).toBeTruthy();
    });
  });

  describe('execute()', () => {
    test('missing item', () => {
      const recipe = new Recipe(['a', 'b']);
      expect(() => taskManager.execute(
        recipe,
        [[itemHolder1, 'a']],
        itemHolder1
      )).toThrow('Missing item');
    });

    test('2 inputs 1 output', () => {
      itemHolder1.addItems([['a', [new Item('a')]], ['b', [new Item('b')]]]);
      const recipe = new Recipe(['a', 'b'], 'c');
      expect(itemHolder1.getProportions().contains('c')).toBeFalsy();
      taskManager.execute(
        recipe,
        [[itemHolder1, ['a', 'b']]],
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
