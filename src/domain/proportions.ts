import { Kind } from "./valueObjects/kind";

export class Proportions {
  private _data: Map<Kind, number>;
  constructor(entries: [Kind, number][]) {
    this._data = new Map(entries);
  }
  private _add(other: Proportions, sign: -1 | 1 = 1): Proportions {
    const result = new Proportions([]);
    this._data.forEach((quantity, kind) => {
      result._data.set(kind, quantity);
    });
    other._data.forEach((quantity, kind) => {
      const q = result.ofKind(kind) + sign * quantity;
      if (!q) {
        result._data.delete(kind);
      } else {
        result._data.set(kind, q);
      }
    });
    return result;
  }
  add(other: Proportions): Proportions {
    return this._add(other);
  }
  sub(other: Proportions): Proportions {
    return this._add(other, -1);
  }
  mul(scale: number): Proportions {
    if (Math.round(scale) !== scale) {
      throw new Error('scale must be a integer');
    }
    const result = new Proportions([]);
    this._data.forEach((quantity, kind) => {
      result._data.set(kind, quantity * scale);
    });
    return result;
  }
  equals(other: Proportions): boolean {
    return this.sub(other).isEmpty();
  }
  contains(other: Proportions): boolean {
    return this.getMissing(other).isEmpty();
  }
  getMissing(other: Proportions): Proportions {
    return new Proportions(other.sub(this).content());
  }
  log(): string {
    return this.content().join(', ');
  }
  content(): [Kind, number][] {
    return [...this._data].filter(([kind, quantity]) => quantity > 0);
  }
  ofKind(kind: string): number {
    return this._data.get(kind) || 0;
  }
  quantities(): number[] {
    return [...this._data.values()];
  }
}