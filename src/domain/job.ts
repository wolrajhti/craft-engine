import { Recipe } from "./recipe";

export class Job {
  private _isSplitted = false;
  private _isProcessing = false;
  constructor(
    public readonly recipe: Recipe,
    public readonly x = 0,
    public readonly y = 0,
  ) {}
  markAsSplitted(): void {
    this._isSplitted = true;
  }
  get isSplitted(): boolean {
    return this._isSplitted;
  }
  markAsProcessing(): void {
    this._isProcessing = true;
  }
  get isProcessing(): boolean {
    return this._isProcessing;
  }
}