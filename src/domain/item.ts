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
  remove(quantity: number): Item {
    if (this._quantity < quantity) {
      throw new Error('Cannot remove this quantity');
    }
    if (0 < this._quantity) {
      this._quantity -= quantity;
      return new Item(this.kind, this.quality, quantity);
    }
    return this;
  }
}