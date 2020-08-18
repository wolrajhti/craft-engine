import { Ingredients } from './ingredients';
import { Proportions, TProportionsData } from './proportions';
import { Item } from './item';
import { Container } from './container';

export class Recipe extends Container {
  private _inputs: Proportions;
  private _outputs: Proportions;
  constructor(
    inputs: TProportionsData = new Proportions(),
    outputs: TProportionsData = new Proportions(),
  ) {
    super()
    if (!(inputs instanceof Proportions)) {
      inputs = new Proportions(inputs);
    }
    if (!(outputs instanceof Proportions)) {
      outputs = new Proportions(outputs);
    }
    this._inputs = inputs;
    this._outputs = outputs;
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
    if (!ingredients.getProportions().equals(this._inputs)) {
      throw new Error('Missing item');
    }
    return new Ingredients(
      this._outputs.content()
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
  scoreFor(proportions: Proportions): number {
    return this.getProportions().getMissing(proportions).getNorm();
  }
}