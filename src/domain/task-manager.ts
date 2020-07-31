import { IRecipe } from './interfaces/recipe';
import { ITaskManager } from './interfaces/task-manager';
import { IItemHolder } from './interfaces/item-holder';
import { IContainer } from './interfaces/container';
import { IItem } from './interfaces/item';

import { ItemHolder } from './item-holder';
import { Item } from './item';
import { Recipe } from './recipe';

export class TaskManager implements ITaskManager {
  constructor(
    private _itemHolders: IItemHolder[],
    private _recipes: IRecipe[],
  ) {}
  execute(recipe: IRecipe, itemHolder: IItemHolder): void {
    const inputs = itemHolder.removeItems(...recipe.getInputs());
    const outputs = recipe.execute(...inputs);
    itemHolder.addItems(...outputs);
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
  private static getBestFor<T extends IContainer>(containers: T[], ...kinds: string[]): T[] {
    const scores = new Map<T, number>(containers.map(container => [container, 0]));
    kinds.forEach(kind => {
      containers.forEach(container => {
        if (container.contains(kind)) {
          scores.set(container, (scores.get(container) || 0) + 1);
        }
      });
    });
    const sortedContainers = [...scores]
      .sort(([, score1], [, score2]) => score1 - score2)
      .map(([container]) => container);
    const result = new Map<T, T>();
    let check = true;
    kinds.forEach(kind => {
      const container = sortedContainers.find(container => container.contains(kind));
      if (container) {
        result.set(container, container);
      } else {
        check = false;
      }
    });
    if (check) {
      return [...result.keys()];
    }
    return [];
  }
  getBestItemHoldersFor(...kinds: string[]): IItemHolder[] {
    return TaskManager.getBestFor<IItemHolder>(this._itemHolders, ...kinds);
  }
  getBestRecipesFor(...kinds: string[]): IRecipe[] {
    return TaskManager.getBestFor<IRecipe>(this._recipes, ...kinds);
  }
  createRecipe(inputs: string[], outputs: string[]): IRecipe {
    const recipe = new Recipe(inputs, outputs);
    this._recipes.push(recipe);
    return recipe;
  }
  createItemHolder(): IItemHolder {
    const itemHolder = new ItemHolder();
    this._itemHolders.push(itemHolder);
    return itemHolder;
  }
  createItemIn(itemHolder: IItemHolder, kind: string): IItem {
    const item = new Item(kind);
    itemHolder.addItems(item);
    return item;
  }
}
