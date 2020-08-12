type _ = string | string[];

export type TKindsData = _ | Kinds;

export class Kinds {
  readonly data: string[];
  constructor(data: _) {
    if (!Array.isArray(data)) {
      data = [data];
    }
    data.sort();
    this.data = data;
  }
  equals(other: Kinds) {
    if (!(other instanceof Kinds)) {
      other = new Kinds(other);
    }
    return JSON.stringify(this.data) === JSON.stringify(other.data);
  }
  includes(kind: string) {
    return this.data.includes(kind);
  }
}