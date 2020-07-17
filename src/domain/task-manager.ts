import { IRecipe } from './interfaces/recipe';
import { ITaskManager } from './interfaces/task-manager';
import { IItem } from './interfaces/item';
import { IItemHolder } from './interfaces/item-holder';

export class TaskManager implements ITaskManager {
  constructor(
    private _itemHolders: IItemHolder[],
    private _recipes: IRecipe[],
  ) {}
  execute(recipe: IRecipe, itemHolder: IItemHolder): IItem[] {
    const items = itemHolder.removeItems(...recipe.getInputs());
    return recipe.execute(...items);
  }
  getBestItemHoldersFor(recipe: IRecipe): IItemHolder[] {
    const inputs = recipe.getInputs();
    const scores = new Map<IItemHolder, number>(this._itemHolders.map(itemHolder => [itemHolder, 0]));
    inputs.forEach(input => {
      this._itemHolders.forEach(itemHolder => {
        if (itemHolder.contains(input)) {
          scores.set(itemHolder, (scores.get(itemHolder) || 0) + 1);
        }
      });
    });
    const itemHolders = [...scores]
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
  contains(...kinds: string[]): boolean {
    return kinds.every(kind => this._itemHolders.some(itemHolder => itemHolder.contains(kind)));
  }
  getMissing(...kinds: string[]): string[] {
    this._itemHolders.forEach(itemHolder => {
      kinds = itemHolder.getMissing(...kinds);
    });
    return kinds;
  }
  getBestTasksFor(recipe: IRecipe): IRecipe[] {
    const missings = this.getMissing(...recipe.getInputs());
    const subTasks: IRecipe[] = [];
    while (missings.length) {
      this._recipes.filter(recipe => recipe.getOutputs().includes);
    }
    return subTasks;
  }
}
