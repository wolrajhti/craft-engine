import { IItemHolder } from './interfaces/item-holder';

import { Ingredients } from './ingredients';
import { Proportions } from './proportions';
import { Item } from './item';
import { Container } from './container';

export class ItemHolder extends Container implements IItemHolder {
  private _items: Map<string, Item[]>;
  constructor() {
    super();
    this._items = new Map();
  }
  private _addItem(item: Item): void {
    const kind = item.getKind();
    this._items.set(kind, [...(this._items.get(kind) || []), item]);
  }
  getProportions(): Proportions {
    return new Proportions([...this._items].map(([kind, items]) => [kind, items.length]));
  }
  addItem(item: Item): void {
    this._addItem(item);
  }
  addItems(items: Item[]): void {
    items.forEach(item => this._addItem(item));
  }
  removeItems(proportions: Proportions): Ingredients {
    return new Ingredients(
      [...proportions]
        .map(([kind, quantity]) => {
          const items = this._items.get(kind);
          if (items) {
            const collected: Item[] = [];
            for (let i = 0; i < quantity; i++) {
              const item = items.shift();
              if (item) {
                collected.push(item);
              } else {
                throw new Error('Missing item');
              }
            }
            return [kind, collected];
          } else {
            throw new Error('Missing item');
          }
        })
    );
  }
  clear(): void {
    this._items.clear();
  }
}