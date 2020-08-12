import { TKindsData, Kinds } from './valueObjects/kinds';

type _ = TKindsData | {kinds: TKindsData, quantity?: number, quality?: number};

export type TItemData = _ | Item;

export class Item {
  readonly kinds: Kinds;
  public quantity: number;
  readonly quality: number;
  constructor(data: _ = []) {
    let kinds: Kinds;
    let quantity = 1;
    let quality = 1;
    if (data instanceof Kinds) {
      kinds = data;
    } else if (
      Array.isArray(data) ||
      typeof data === 'string'
    ) {
      kinds = new Kinds(data);
    } else {
      if (data.kinds instanceof Kinds) {
        kinds = data.kinds;
      } else {
        kinds = new Kinds(data.kinds || []);
      }
      if (data.hasOwnProperty('quantity')) {
        quantity = data.quantity as number;
      }
      if (data.hasOwnProperty('quality')) {
        quality = data.quality as number;
      }
    };
    this.kinds = kinds;
    this.quantity = quantity;
    this.quality = quality;
  }
  remove(quantity: number): Item {
    if (this.quantity < quantity) {
      throw new Error('Cannot remove this quantity');
    }
    if (0 < this.quantity) {
      this.quantity -= quantity;
      return new Item({kinds: this.kinds, quantity, quality: this.quality});
    }
    return this;
  }
  equals(other: TItemData): boolean {
    if (!(other instanceof Item)) {
      other = new Item(other);
    }
    return this.kinds.equals((other as Item).kinds) && 
      this.quantity === other.quantity &&
      this.quality === other.quality;
  }
}