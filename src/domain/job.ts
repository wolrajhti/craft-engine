import { Recipe } from "./recipe";

export class Job {
  private _isSplitted = false;
  constructor(public readonly recipe: Recipe) {}
  markAsSplitted(): void {
    this._isSplitted = true;
  }
  isSplitted(): boolean {
    return this._isSplitted;
  }
}