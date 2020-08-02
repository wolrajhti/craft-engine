import { IItemHolder } from './item-holder';
import { IRecipe } from './recipe';
import { IContainer } from './container';
import { IProportions } from './proportions';
import { ISource } from './source';

export interface ITaskManager extends IContainer {
  execute(recipe: IRecipe, src: ISource<IItemHolder>, dest: IItemHolder): void;
  getBestItemHoldersFor(proportions: IProportions): ISource<IItemHolder>;
  getBestRecipesFor(proportions: IProportions): ISource<IRecipe>;
}
