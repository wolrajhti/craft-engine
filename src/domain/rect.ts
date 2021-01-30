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
  static MergeTopLeft(r1: Rect, r2: Rect, optimize = false): Rect[] {
    if (r1.x === r2.x && r1.y === r2.y - r1.h) {
      if (r1.w < r2.w && r2.h < r1.w && optimize) {
        // 111       111
        // 111    -> 111
        // 222222    111222
        return [
          new Rect(r1.x, r1.y, r1.w, r1.h + r2.h),
          new Rect(r1.x + r1.w, r2.y, r2.w - r1.w, r2.h)
        ];
      } else if (r1.w === r2.w) {
        // 111111    222222
        // 111111 -> 222222
        // 222222    222222
        return [new Rect(r1.x, r1.y, r1.w, r1.h + r2.h)];
      }
    }
    return [];
  }
  project(x: number, y: number): [number, number] {
    return [
      Math.max(this.x, Math.min(x, this.x + this.w - 1)),
      Math.max(this.y, Math.min(y, this.y + this.h - 1))
    ];
  }
}