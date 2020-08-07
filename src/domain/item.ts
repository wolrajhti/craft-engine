export class Item {
  readonly kinds: string[];
  constructor(
    kinds: string | string[],
  ) {
    if (!Array.isArray(kinds)) {
      kinds = [kinds];
    }
    this.kinds = kinds;
  }
  equals(other: Item): boolean {
    return this === other;
  }
}