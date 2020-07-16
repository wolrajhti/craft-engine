import { IItem } from './interfaces/item';

export class Item implements IItem {
  constructor(
    private _kind: string,
  ) {}
  getKind(): string {
    return this._kind;
  }
}