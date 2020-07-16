import { Item } from './item';
import { IItem } from './interfaces/item';
import { ITask } from './interfaces/task';

export class Task implements ITask {
  constructor(
    private _inputs: string[],
    private _outputs: string[],
  ) {}
  getInputs(): string[] {
    return this._inputs;
  }
  getOutputs(): IItem[] {
    return this._outputs.map(kind => new Item(kind));
  }
}