import { Recipe } from "./recipe";

export class Job {
  private _isSplitted = false;
  constructor(
    public readonly recipe: Recipe,
    public readonly x = 0,
    public readonly y = 0,
  ) {}
  markAsSplitted(): void {
    this._isSplitted = true;
  }
  isSplitted(): boolean {
    return this._isSplitted;
  }
}