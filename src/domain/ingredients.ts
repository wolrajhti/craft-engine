import { Item, TItemData } from './item';
import { Proportions, TProportionsData } from './proportions';

type _ = [string, TItemData[]][];

export type TIngredientsData = _ | Ingredients;

export class Ingredients {
  private _data: Map<string, Item[]>;
  constructor(data: _ = []) {
    this._data = new Map(data.map(([kind, itemDatas]) => {
      return [kind, itemDatas.map(itemData => {
        if (!(itemData instanceof Item)) {
          itemData = new Item(itemData);
        }
        return itemData as Item;
      })];
    }));
  }
  private _half_equals(other: Ingredients): boolean {
    let result = true;
    this.forEachKind((items, kind) => {
      if (result && items.length) {
        const otherItems = other.ofKind(kind);
        if (
          items.length !== otherItems.length &&
          !items.every(item => otherItems.some(otherItem => item.equals(otherItem)))
        ) {
          result = false;
        }
      }
    });
    return result;
  }
  equals(other: TIngredientsData): boolean {
    if (!(other instanceof Ingredients)) {
      other = new Ingredients(other);
    }
    return this._half_equals(other) && other._half_equals(this);
  }
  getProportions(): Proportions {
    return new Proportions(
      this.content()
        .map(([kind, items]) => [kind, items.reduce((acc, item) => {
          return acc + item.quantity;
        }, 0)])
    );
  }
  addItem(kind: string, ...items: Item[]): void {
    if (!items.some(item => item.kinds.includes(kind))) {
      throw new Error('Given item is not of given kind');
    }
    this._data.set(kind, [...this.ofKind(kind), ...items]);
  }
  addItems(entries: [string, Item[]][]): void {
    entries.forEach(([kind, items]) => {
      items.forEach(item => {
        this.addItem(kind, item);
      });
    });
  }
  removeItems(proportions: TProportionsData): Ingredients {
    if (!(proportions instanceof Proportions)) {
      proportions = new Proportions(proportions);
    }
    return new Ingredients(
      proportions.content()
        .map(([kind, quantity]) => {
          const items = this.ofKind(kind);
          const collected: Item[] = [];
          let collectedQuantity = 0;
          while (collectedQuantity < quantity && !!items.length) {
            const item = items.shift() as Item;
            const collecting = Math.min(item.quantity, quantity - collectedQuantity);
            collectedQuantity += collecting;
            collected.push(item.remove(collecting));
            if (item.quantity > 0) {
              items.unshift(item);
            }
          }
          if (collectedQuantity === quantity) {
            return [kind, collected];
          }
          throw new Error('Missing item');
        })
    );
  }
  clear(): void {
    this._data.clear();
  }
  content(): [string, Item[]][] {
    return [...this._data].filter(([kind, items]) => !!items.length);
  }
  ofKind(kind: string): Item[] {
    return this._data.get(kind) || [];
  }
  forEachKind(callbackfn: (value: Item[], key: string) => void) {
    this._data.forEach(callbackfn);
  }
}
