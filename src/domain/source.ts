import { Proportions, TProportionsData } from './proportions';
import { Container } from './container';

type _<T> = [T, TProportionsData][];

export type TSourceData<T extends Container> = _<T> | Source<T>;

export class Source<T extends Container> {
  private _data: Map<T, Proportions>;
  constructor(data: _<T> = []) {
    this._data = new Map(data.map(([container, proportionsData]) => {
      if (!(proportionsData instanceof Proportions)) {
        proportionsData = new Proportions(proportionsData);
      }
      return [container, proportionsData];
    }));
  }
  private _half_equals(other: Source<T>): boolean {
    let result = true;
    this._data.forEach((proportions, container) => {
      if (result && !proportions.isEmpty()) {
        const otherProportions = other.ofContainer(container);
        if (
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
  ofContainer(container: T): Proportions {
    return this._data.get(container) || new Proportions();
  }
  containers(): T[] {
    return [...this._data.keys()];
  }
}
