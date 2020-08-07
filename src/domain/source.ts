import { Proportions, TProportionsData } from './proportions';
import { Container } from './container';

type _<T> = [T, TProportionsData][];

export type TSourceData<T extends Container> = _<T> | Source<T>;

export class Source<T extends Container> extends Map<T, Proportions> {
  constructor(data: _<T> = []) {
    super(data.map(([container, proportionsData]) => {
      if (!(proportionsData instanceof Proportions)) {
        proportionsData = new Proportions(proportionsData);
      }
      return [container, proportionsData];
    }));
  }
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
  equals(other: TSourceData<T>): boolean {
    if (!(other instanceof Source)) {
      other = new Source(other);
    }
    return this._half_equals(other) && other._half_equals(this);
  }
}
