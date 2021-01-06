export class Kind {
  private _children = new Set<Kind>();
  private _parent?: Kind;
  constructor(readonly name: string) { }
  add(other: Kind): void {
    other._parent = this;
    this._children.add(other);
  }
  is(other: Kind): boolean {
    if (this.name !== other.name) {
      return !!this._parent && this._parent.is(other);
    }
    if (!this._parent) {
      return true;
    }
    return !!other._parent && this._parent.is(other._parent);
  }
  childCount(): number {
    let sum = 0;
    this._children.forEach(child => sum += child.childCount() + 1);
    return sum;
  }
}