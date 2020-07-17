import { IItem } from './item';
import { IItemHolder } from './item-holder';
import { IRecipe } from './task';

export interface ITaskManager {
  execute(task: IRecipe, itemHolder: IItemHolder): IItem[];
  getBestItemHoldersFor(task: IRecipe): IItemHolder[];
  contains(...kinds: string[]): boolean;
  getMissing(...kinds: string[]): string[];
  getBestTasksFor(task: IRecipe): IRecipe[];
}
