import { Kind } from './valueObjects/kind';

export class Item {
  private _quantity: number;
  constructor(
    readonly kind: Kind,
    readonly quality = 1,
    quantity = 1
  ) {
    this._quantity = quantity;
  }
  get quantity(): number {
    return this._quantity;
  }
  remove(quantity: number): Item {
    this._quantity -= Math.min(this._quantity, quantity);
    if (0 < this._quantity) {
      return new Item(this.kind, this.quality, quantity);
    }
    return this;
  }
}