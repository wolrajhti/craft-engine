import { IIngredients } from './interfaces/ingredients';

import { Item } from './item';

export class Ingredients extends Map<string, Item[]> implements IIngredients {
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
  equals(other: Ingredients): boolean {
    return this._half_equals(other) && other._half_equals(this);
  }
}
