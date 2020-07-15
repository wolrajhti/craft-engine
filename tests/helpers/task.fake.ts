import { ITask } from '../../src/task';

export class Task implements ITask {
  constructor(
    private _inputs: string[],
    private _outputs: string[],
  ) {}
  getInputs() {
    return this._inputs;
  }
  getOutputs() {
    return this._outputs;
  }
}