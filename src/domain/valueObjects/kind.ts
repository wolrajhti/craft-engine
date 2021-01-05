export class Kind {
  constructor(
    readonly name: string,
    readonly parent?: Kind
  ) { }
  is(other: Kind): boolean {
    if (this.name !== other.name) {
      return !!this.parent && this.parent.is(other);
    }
    if (!this.parent) {
      return true;
    }
    return !!other.parent && this.parent.is(other.parent);
  }
}