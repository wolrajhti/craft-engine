export class Item {
  constructor(
    private _kind: string,
  ) {}
  getKind(): string {
    return this._kind;
  }
  equals(other: Item): boolean {
    return this._kind === other._kind;
  }
}