import { Ingredients } from './ingredients';
import { Proportions, TProportionsData } from './proportions';
import { Item } from './item';
import { Container } from './container';

export class ItemHolder extends Container {
  private _items: Ingredients;
  constructor(data: [string, Item[]][] = []) {
    super();
    this._items = new Ingredients(data);
  }
  getProportions(): Proportions {
    return this._items.getProportions();
  }
  addItem(item: Item): void {
    this._items.addItem(item);
  }
  addItems(items: Item[]): void {
    this._items.addItems(items);
  }
  removeItems(proportions: TProportionsData): Ingredients {
    return this._items.removeItems(proportions);
  }
  clear(): void {
    this._items.clear();
  }
}