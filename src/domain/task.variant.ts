import { Item } from './item';
import { IItem } from './interfaces/item';
import { ITask } from './interfaces/task';

export class TaskVariant implements ITask {
  constructor(
    private _input1: string,
    private _input2: string,
    private _output: string,
  ) {}
  getInputs(): string[] {
    return [this._input1, this._input2];
  }
  getOutputs(): IItem[] {
    return [new Item(this._output)];
  }
}