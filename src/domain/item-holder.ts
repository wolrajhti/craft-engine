import { Ingredients } from './ingredients';
import { Proportions, TProportionsData } from './proportions';
import { Item } from './item';
import { Container } from './container';

export class ItemHolder extends Container {
  private _items: Ingredients;
  constructor(
    data: [string, Item[]][] = [],
    protected _x = 0,
    protected _y = 0
  ) {
    super();
    this._items = new Ingredients(data);
  }
  getProportions(): Proportions {
    return this._items.getProportions();
  }
  addItem(kind: string, item: Item): void {
    this._items.addItem(kind, item);
  }
  addItems(entries: [string, Item[]][]): void {
    this._items.addItems(entries);
  }
  removeItems(proportions: TProportionsData): Ingredients {
    return this._items.removeItems(proportions);
  }
  clear(): void {
    this._items.clear();
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
  scoreFor(proportions: Proportions, x: number, y: number): number {
    return Math.sqrt(
      this.getProportions().getMissing(proportions).getNorm2() +
      (x - this._x) * (x - this._x) +
      (y - this._y) * (y - this._y)
    );
  }
}