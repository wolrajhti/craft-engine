import { Item } from './item';
import { Proportions, TProportionsData } from './proportions';

export type TIngredientsData = [string, Item[]][] | Ingredients;

export class Ingredients extends Map<string, Item[]> {
  private _half_equals(other: Ingredients): boolean {
    let result = true;
    this.forEach((items, kind) => {
      if (result && items.length) {
        const otherItems = other.get(kind);
        if (
          !otherItems ||
          !(
            items.length === otherItems.length &&
            items.every(item => otherItems.some(otherItem => item.equals(otherItem)))
          )
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
      [...this]
        .filter(([kind, items]) => !!items.length)
        .map(([kind, items]) => [kind, items.length])
    );
  }
  private _addItem(item: Item): void {
    const kind = item.getKind();
    this.set(kind, [...(this.get(kind) || []), item]);
  }
  addItem(item: Item): void {
    this._addItem(item);
  }
  addItems(items: Item[]): void {
    items.forEach(item => this._addItem(item));
  }
  removeItems(proportions: TProportionsData): Ingredients {
    if (!(proportions instanceof Proportions)) {
      proportions = new Proportions(proportions);
    }
    return new Ingredients(
      [...proportions]
        .filter(([kind, quantity]) => !!quantity)
        .map(([kind, quantity]) => {
          const items = this.get(kind);
          if (items && quantity <= items.length) {
            return [kind, items.splice(0, quantity)];
          } else {
            throw new Error('Missing item');
          }
        })
    );
  }
}
