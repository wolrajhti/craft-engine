type _ = string | (string | [string, number])[];

export type TProportionsData = _ | Proportions;

export class Proportions extends Map<string, number> {
  constructor(data: _ = []) {
    const entries: [string, number][] = [];
    if (!Array.isArray(data)) {
      data = [data];
    }
    data.forEach(value => {
      if (!Array.isArray(value)) {
        value = [value, 1];
      }
      const [kind, quantity] = value;
      if (typeof kind !== 'string') {
        throw new Error('kind must be a string');
      }
      if (typeof quantity !== 'number' || Math.round(quantity) !== quantity) {
        throw new Error('quantity must be a integer');
      }
      entries.push([kind, quantity]);
    });
    super(entries);
  }
  getNorm(): number {
    return Math.sqrt([...this.values()].reduce((acc, quantity) => acc + quantity * quantity, 0));
  }
  isEmpty(): boolean {
    return this.getNorm() === 0;
  }
  private _add(other: TProportionsData, sign: -1 | 1 = 1): Proportions {
    if (!(other instanceof Proportions)) {
      other = new Proportions(other);
    }
    const result = new Proportions();
    this.forEach((quantity, kind) => {
      result.set(kind, quantity);
    });
    other.forEach((quantity, kind) => {
      const q = (result.get(kind) || 0) + sign * quantity;
      if (!q) {
        result.delete(kind);
      } else {
        result.set(kind, q);
      }
    });
    return result;
  }
  add(other: TProportionsData): Proportions {
    if (!(other instanceof Proportions)) {
      other = new Proportions(other);
    }
    return this._add(other);
  }
  sub(other: TProportionsData): Proportions {
    if (!(other instanceof Proportions)) {
      other = new Proportions(other);
    }
    return this._add(other, -1);
  }
  mul(scale: number): Proportions {
    if (Math.round(scale) !== scale) {
      throw new Error('scale must be a integer');
    }
    const result = new Proportions();
    this.forEach((quantity, kind) => {
      result.set(kind, quantity * scale);
    });
    return result;
  }
  equals(other: TProportionsData): boolean {
    if (!(other instanceof Proportions)) {
      other = new Proportions(other);
    }
    return this.sub(other).isEmpty();
  }
  contains(other: TProportionsData): boolean {
    if (!(other instanceof Proportions)) {
      other = new Proportions(other);
    }
    return this.getMissing(other).isEmpty();
  }
  getMissing(other: TProportionsData): Proportions {
    if (!(other instanceof Proportions)) {
      other = new Proportions(other);
    }
    return new Proportions([
      ...this.sub(other)
    ]
      .filter(([kind, quantity]) => quantity < 0)
    ).mul(-1);
  }
  log(): string {
    return [...this].join(', ');
  }
}