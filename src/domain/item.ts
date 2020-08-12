import { TKindsData, Kinds } from './valueObjects/kinds';

export class Item {
  readonly kinds: Kinds;
  constructor(
    kinds: TKindsData,
    public quantity = 1,
    readonly quality = 1,
  ) {
    if (!(kinds instanceof Kinds)) {
      kinds = new Kinds(kinds);
    }
    this.kinds = kinds;
  }
  remove(quantity: number): Item {
    if (this.quantity < quantity) {
      throw new Error('Cannot remove this quantity');
    }
    if (0 < this.quantity) {
      this.quantity -= quantity;
      return new Item(this.kinds, quantity, this.quality);
    }
    return this;
  }
  equals(other: Item): boolean {
    return this.kinds.equals(other.kinds) && 
      this.quantity === other.quantity &&
      this.quality === other.quality;
  }
}