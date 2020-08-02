import { IItem } from './item';
import { IContainer } from './container';
import { IProportions } from './proportions';
import { IIngredients } from './ingredients';


export interface IItemHolder extends IContainer {
  addItem(item: IItem): void;
  addItems(items: IItem[]): void;
  removeItems(proportions: IProportions): IIngredients;
}