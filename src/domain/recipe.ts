import { Item } from './item';
import { IItem } from './interfaces/item';
import { IRecipe } from './interfaces/recipe';

export class Recipe implements IRecipe {
  constructor(
    private _inputs: string[],
    private _outputs: string[],
  ) {}
  contains(...kinds: string[]): boolean {
    return kinds.every(kind => this._outputs.includes(kind));
  }
  getMissing(...kinds: string[]): string[] {
    return kinds.filter(kind => !this.contains(kind));
  }
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