import { Item } from './item';
import { IItem } from './interfaces/item';
import { IRecipe } from './interfaces/recipe';

export class Recipe implements IRecipe {
  constructor(
    private _inputs: string[],
    private _outputs: string[],
  ) {}
  getInputs(): string[] {
    return this._inputs;
  }
  getOutputs(): string[] {
    return this._outputs;
  }
  execute(...inputs: IItem[]): IItem[] {
    return this._outputs.map(kind => new Item(kind));
  }
}