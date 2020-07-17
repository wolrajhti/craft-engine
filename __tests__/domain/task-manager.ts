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
      const kind1 = 'a';
      const kind2 = 'b';
      const item1 = new Item(kind1);
      const item2 = new Item(kind2);
      itemHolder1.addItems(item1, item2);
      expect(taskManager.getBestItemHoldersFor(kind1, kind2)).toStrictEqual([itemHolder1]);
    });

    test('2 items in 2 holders', () => {
      const kind1 = 'a';
      const kind2 = 'b';
      const item1 = new Item(kind1);
      const item2 = new Item(kind2);
      itemHolder1.addItems(item1);
      itemHolder2.addItems(item2);
      expect(taskManager.getBestItemHoldersFor(kind1, kind2)).toStrictEqual([itemHolder1, itemHolder2]);
    });

    test('3 items in 2 holders', () => {
      const kind1 = 'a';
      const kind2 = 'b';
      const kind3 = 'c';
      const item1 = new Item(kind1);
      const item2 = new Item(kind2);
      const item3 = new Item(kind3);
      itemHolder1.addItems(item1);
      itemHolder2.addItems(item2, item3);
      expect(taskManager.getBestItemHoldersFor(kind1, kind2, kind3)).toStrictEqual([itemHolder1, itemHolder2]);
    });

    test('3 items with 1 missing', () => {
      const kind1 = 'a';
      const kind2 = 'b';
      const kind3 = 'c';
      const item1 = new Item(kind1);
      const item2 = new Item(kind2);
      itemHolder1.addItems(item1);
      itemHolder2.addItems(item2);
      expect(taskManager.getBestItemHoldersFor(kind1, kind2, kind3)).toStrictEqual([]);
    });
  });

  describe('execute()', () => {
    test('missing item', () => {
      const recipe = new Recipe(['a', 'b'], []);
      expect(() => taskManager.execute(recipe, itemHolder1)).toThrow('Missing item');
    });

    test('2 inputs 1 output', () => {
      const kind1 = 'a';
      const kind2 = 'b';
      const kind3 = 'c';
      const item1 = new Item(kind1);
      const item2 = new Item(kind2);
      itemHolder1.addItems(item1, item2);
      const recipe = new Recipe([kind1, kind2], [kind3]);
      expect(itemHolder1.contains(kind3)).toBeFalsy();
      taskManager.execute(recipe, itemHolder1);
      expect(itemHolder1.contains(kind3)).toBeTruthy();
      expect(itemHolder1.contains(kind3, kind3)).toBeFalsy();
    });
  });

  test('contains', () => {
    expect(taskManager.contains('a')).toBeFalsy();
    itemHolder1.addItems(new Item('a'));
    expect(taskManager.contains('a')).toBeTruthy();
    expect(taskManager.contains('a', 'b')).toBeFalsy();
    itemHolder1.addItems(new Item('b'));
    expect(taskManager.contains('a', 'b')).toBeTruthy();
    expect(taskManager.contains('a', 'b', 'c')).toBeFalsy();
    itemHolder1.addItems(new Item('c'));
    expect(taskManager.contains('a', 'b', 'c')).toBeTruthy();
  });

  test('getMissing()', () => {
    expect(taskManager.getMissing('a')).toStrictEqual(['a']);
    itemHolder1.addItems(new Item('a'));
    expect(taskManager.getMissing('a')).toStrictEqual([]);
    expect(taskManager.getMissing('a', 'b')).toStrictEqual(['b']);
    itemHolder1.addItems(new Item('b'));
    expect(taskManager.getMissing('a', 'b')).toStrictEqual([]);
    expect(taskManager.getMissing('a', 'b', 'c')).toStrictEqual(['c']);
    itemHolder1.addItems(new Item('c'));
    expect(taskManager.getMissing('a', 'b', 'c')).toStrictEqual([]);
  });

  describe('getBestTasksFor()', () => {
    test('', () => {

    });
  });

});
