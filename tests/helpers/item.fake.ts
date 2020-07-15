import { IItem } from '../../src/item';

export class ItemFake implements IItem {
  constructor(
    private _kind: string,
  ) {}
  getKind(): string {
    return this._kind;
  }  
}