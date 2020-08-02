import { IContainer } from './container';
import { IProportions } from './proportions';

import { IIngredients } from './ingredients';

export interface IRecipe extends IContainer {
  getInputs(): IProportions;
  getOutputs(): IProportions;
  execute(ingredients: IIngredients): IIngredients;
  markAsSplitted(): void;
  isSplitted(): boolean;
}
