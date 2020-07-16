import { IItem } from './item';

export interface ITask {
  getInputs(): string[];
  getOutputs(): IItem[];
}
