import { IItem } from './item';

export interface IRecipe {
  getInputs(): string[];
  getOutputs(): string[];
  execute(...inputs: IItem[]): IItem[];
}
