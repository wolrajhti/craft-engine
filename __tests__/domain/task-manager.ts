import { TaskManager } from '../../src/domain/task-manager';
import { ItemHolder } from '../../src/domain/item-holder';
import { Item } from '../../src/domain/item';
import { Task } from '../../src/domain/task';

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

  describe('getCandidates() & getValidCandidates()', () => {
    test('2 items in 1 holder', () => {
      const kind1 = 'a';
      const kind2 = 'b';
      const item1 = new Item(kind1);
      const item2 = new Item(kind2);
      itemHolder1.addItems(item1, item2);
      const task = new Task([kind1, kind2], []);
      expect(taskManager.getValidCandidates(task)).toStrictEqual([itemHolder1]);
    });

    test('2 items in 2 holders', () => {
      const kind1 = 'a';
      const kind2 = 'b';
      const item1 = new Item(kind1);
      const item2 = new Item(kind2);
      itemHolder1.addItems(item1);
      itemHolder2.addItems(item2);
      const task = new Task([kind1, kind2], []);
      expect(taskManager.getValidCandidates(task)).toStrictEqual([]);
      expect(taskManager.getCandidates(task)).toStrictEqual([itemHolder1, itemHolder2]);
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
      const task = new Task([kind1, kind2, kind3], []);
      expect(taskManager.getValidCandidates(task)).toStrictEqual([]);
      expect(taskManager.getCandidates(task)).toStrictEqual([itemHolder1, itemHolder2]);
    });

    test('3 items with 1 missing', () => {
      const kind1 = 'a';
      const kind2 = 'b';
      const kind3 = 'c';
      const item1 = new Item(kind1);
      const item2 = new Item(kind2);
      itemHolder1.addItems(item1);
      itemHolder2.addItems(item2);
      const task = new Task([kind1, kind2, kind3], []);
      expect(taskManager.getCandidates(task)).toStrictEqual([]);
    });
  });

  describe('execute()', () => {
    test('missing item', () => {
      const task = new Task(['a', 'b'], []);
      expect(() => taskManager.execute(task, itemHolder1)).toThrow('Missing item');
    });

    test('2 inputs 1 output', () => {
      const kind1 = 'a';
      const kind2 = 'b';
      const kind3 = 'c';
      const item1 = new Item(kind1);
      const item2 = new Item(kind2);
      itemHolder1.addItems(item1, item2);
      const task = new Task([kind1, kind2], [kind3]);
      const items = taskManager.execute(task, itemHolder1);
      expect(items.length).toStrictEqual(1);
      expect(items[0].getKind()).toStrictEqual(kind3);
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

});
