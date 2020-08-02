import { IItem } from './interfaces/item';

export class Item implements IItem {
  constructor(
    private _kind: string,
  ) {}
  getKind(): string {
    return this._kind;
  }
  equals(other: Item): boolean {
    return this._kind === other._kind;
  }
}