import { Item } from './item';
import { IItem } from './interfaces/item';
import { IRecipe } from './interfaces/recipe';

export class Recipe implements IRecipe {
  private _isSplitted = false;
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
  log(): string {
    return `${this._inputs.join(', ')} => ${this._outputs.join(', ')}`;
  }
  markAsSplitted(): void {
    this._isSplitted = true;
  }
  isSplitted(): boolean {
    return this._isSplitted;
  }
}