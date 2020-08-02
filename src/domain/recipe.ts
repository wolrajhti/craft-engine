import { IRecipe } from './interfaces/recipe';

import { Ingredients } from './ingredients';
import { Proportions } from './proportions';
import { Item } from './item';
import { Container } from './container';

export class Recipe extends Container implements IRecipe {
  private _isSplitted = false;
  constructor(
    private _inputs: Proportions,
    private _outputs: Proportions,
  ) {
    super()
  }
  getProportions(): Proportions {
    return this._outputs;
  }
  getInputs(): Proportions {
    return this._inputs;
  }
  getOutputs(): Proportions {
    return this._outputs;
  }
  execute(ingredients: Ingredients): Ingredients {
    return new Ingredients(
      [...this._outputs]
        .map(([kind, quantity]) => {
          const items: Item[] = [];
          for (let i = 0; i < quantity; i++) {
            items.push(new Item(kind));
          }
          return [kind, items];
        })
    );
  }
  log(): string {
    return `${this._inputs.log()} => ${this._outputs.log()}`;
  }
  markAsSplitted(): void {
    this._isSplitted = true;
  }
  isSplitted(): boolean {
    return this._isSplitted;
  }
}