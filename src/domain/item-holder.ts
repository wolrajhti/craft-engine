import { Proportions } from './proportions';
import { Item } from './item';
import { Kind } from './valueObjects/kind';

export class ItemHolder {
  private _items: Set<Item>;
  private _x: number;
  private _y: number;
  constructor(
    items: Item[],
    x: number,
    y: number
  ) {
    this._items = new Set(items);
    this._x = x;
    this._y = y;
  }
  get x(): number {
    return this._x;
  }
  get y(): number {
    return this._y;
  }
  moveTo(x: number, y: number): void {
    this._x = x;
    this._y = y;
  }
  move(dx: number, dy: number): void {
    this._x += dx;
    this._y += dy;
  }
  addItem(item: Item): void {
    this._items.add(item);
  }
  addItems(items: Item[]): void {
    items.forEach(item => this.addItem(item));
  }
  removeBestItemsFor(proportions: Proportions): Item[] {
    const items = new Set<Item>();

    // attention un item peut répondre à 2 kind de la proportion, il faut l'associer au mieux
    
    proportions.content()
      .forEach(([kind, quantity]) => {
        const bestItems = this._bestItemsForKind(kind);
        const collected: Item[] = [];
        let collectedQuantity = 0;
        while (collectedQuantity < quantity && !!bestItems.length) {
          const item = bestItems.shift() as Item;
          const collecting = Math.min(item.quantity, quantity - collectedQuantity);
          collectedQuantity += collecting;
          collected.push(item.remove(collecting));
          if (item.quantity > 0) {
            bestItems.unshift(item);
          }
        }
        items.add(collected);
      });

    return [...items];
  }
  private _bestItemsForKind(kind: Kind): Item[] {
    let childCount1: number;
    let childCount2: number;

    const bestItems: Item[] = [];

    this._items
      .forEach(item => {
        if (item.kind.is(kind)) {
          bestItems.push(item);
        }
      });

    // higher quality is the best
    // after quality, lower childCount is better
    // after childCount, lower quantity is better
    bestItems
      .sort((i1, i2) => {
        if (i1.quality === i2.quality) {
          childCount1 = i1.kind.childCount();
          childCount2 = i2.kind.childCount();
          if (childCount1 === childCount2) {
            return i2.quantity - i1.quantity;
          }
          return childCount2 - childCount1;
        }
        return i1.quality - i2.quality;
      });

    return bestItems;
  }
}