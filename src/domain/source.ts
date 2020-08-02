import { ISource } from './interfaces/source';
import { IContainer } from './interfaces/container';

import { Proportions } from './proportions';

export class Source<T extends IContainer> extends Map<T, Proportions> implements ISource<T> {
  private _half_equals(other: Source<T>): boolean {
    let result = true;
    this.forEach((proportions, kind) => {
      if (result && !proportions.isEmpty()) {
        const otherProportions = other.get(kind);
        if (
          !otherProportions ||
          !proportions.equals(otherProportions)
        ) {
          result = false;
        }
      }
    });
    return result;
  }
  equals(other: Source<T>): boolean {
    return this._half_equals(other) && other._half_equals(this);
  }
}
