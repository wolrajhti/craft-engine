import { ITask } from '../../src/task';
import { ITaskManager } from '../../src/task-manager';
import { IItem } from '../../src/item';
import { IItemHolder } from '../../src/item-holder';

export class TaskManager implements ITaskManager {
  constructor(
    private _itemHolders: IItemHolder[],
  ) {}
  execute(task: ITask): IItem[] {
    // const items = itemHolder.removeItems(...this.inputs);
    // const item = {} as IItem;
    // return item; 
    return [];
  }
  getValidCandidates(task: ITask): IItemHolder[] {
    const inputs = task.getInputs();
    return this._itemHolders.filter(itemHolder => itemHolder.contains(...inputs));
  }
  getCandidates(task: ITask): IItemHolder[] {
    const inputs = task.getInputs();
    const scores = new Map<IItemHolder, number>(this._itemHolders.map(itemHolder => [itemHolder, 0]));
    inputs.forEach(input => {
      this._itemHolders.forEach(itemHolder => {
        if (itemHolder.contains(input)) {
          scores.set(itemHolder, scores.get(itemHolder) + 1);
        }
      });
    });
    const itemHolders = [...scores.entries()]
      .sort(([, score1], [, score2]) => score1 - score2)
      .map(([itemHolder]) => itemHolder);
    const result = new Map<IItemHolder, IItemHolder>();
    let check = true;
    inputs.forEach(input => {
      const itemHolder = itemHolders.find(itemHolder => itemHolder.contains(input));
      if (itemHolder) {
        result.set(itemHolder, itemHolder);
      } else {
        check = false;
      }
    });
    if (check) {
      return [...result.keys()];
    }
    return [];
  }
}
