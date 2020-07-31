import { IItem } from './item';
import { IContainer } from './container';

export interface IRecipe extends IContainer {
  getInputs(): string[];
  getOutputs(): string[];
  execute(...inputs: IItem[]): IItem[];
  markAsSplitted(): void;
  isSplitted(): boolean;
}
