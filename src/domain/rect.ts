export class Rect {
  constructor(
    public x = 0,
    public y = 0,
    public w = 0,
    public h = 0,
  ) {
  }
  turnLeft(): Rect {
    return new Rect(-this.y - this.h, this.x, this.h, this.w);
  }
  turnRight(): Rect {
    return new Rect(this.y, -this.x - this.w, this.h, this.w);
  }
  mirrorX(): Rect {
    return new Rect(-this.x - this.w, this.y, this.w, this.h);
  }
  mirrorY(): Rect {
    return new Rect(this.x, -this.y - this.h, this.w, this.h);
  }
  toString(): string {
    return `(${this.x}, ${this.y}, ${this.w}, ${this.h})`;
  }
  contains(x: number, y: number): boolean {
    return (this.x <= x && x < this.x + this.w) &&
      (this.y <= y && y < this.y + this.h);
  }
  equals(other: Rect): boolean {
    return this.x === other.x &&
      this.y === other.y &&
      this.w === other.w &&
      this.h === other.h;
  }
  area(): number {
    return this.w * this.h;
  }
}