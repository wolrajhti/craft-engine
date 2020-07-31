import { IItemHolder } from './item-holder';
import { IRecipe } from './recipe';
import { IContainer } from './container';

export interface ITaskManager extends IContainer {
  execute(recipe: IRecipe, src: IItemHolder[], dest: IItemHolder): void;
  getBestItemHoldersFor(...kinds: string[]): IItemHolder[];
  getBestRecipesFor(...kinds: string[]): IRecipe[];
}
