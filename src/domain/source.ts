import { Proportions } from './proportions';
import { Container } from './container';

export class Source<T extends Container> extends Map<T, Proportions> {
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
