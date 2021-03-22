import { Vector2 } from './vector2';

export class Rect {
  constructor(
    public x = 0,
    public y = 0,
    public w = 0,
    public h = 0,
  ) {
  }
  get x2(): number {
    return this.x + this.w - 1;
  }
  get y2(): number {
    return this.y + this.h - 1;
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
  cx(): number {
    return this.x + 0.5 * (this.w - 1);
  }
  cy(): number {
    return this.y + 0.5 * (this.h - 1);
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
        // 111111    111111
        // 111111 -> 111111
        // 222222    111111
        return [new Rect(r1.x, r1.y, r1.w, r1.h + r2.h)];
      }
    }
    return [];
  }
  projectX(x: number): number {
    return Math.max(this.x, Math.min(x, this.x + this.w - 1));
  }
  projectY(y: number): number {
    return Math.max(this.y, Math.min(y, this.y + this.h - 1));
  }
  commonEdgeWith(other: Rect): Vector2[] {
    let i: number, j: number;
    const ns: Vector2[] = [];

    // left
    if (this.x + this.w === other.x) {
      i = other.projectY(this.y);
      j = other.projectY(this.y2);
      ns.push(new Vector2(other.x - 1, i), new Vector2(other.x, i));
      if (j !== i) {
        ns.push(new Vector2(other.x - 1, j), new Vector2(other.x, j));
      }
    }
    // bottom
    if (this.y + this.h === other.y) {
      i = other.projectX(this.x2);
      j = other.projectX(this.x);
      ns.push(new Vector2(i, other.y - 1), new Vector2(i, other.y));
      if (j !== i) {
        ns.push(new Vector2(j, other.y - 1), new Vector2(j, other.y));
      }
    }
    // right
    if (other.x + other.w === this.x) {
      i = other.projectY(this.y2);
      j = other.projectY(this.y);
      ns.push(new Vector2(this.x, i), new Vector2(this.x - 1, i));
      if (j !== i) {
        ns.push(new Vector2(this.x, j), new Vector2(this.x - 1, j));
      }
    }
    // top
    if (other.y + other.h === this.y) {
      i = other.projectX(this.x);
      j = other.projectX(this.x2);
      ns.push(new Vector2(i, this.y), new Vector2(i, this.y - 1));
      if (j !== i) {
        ns.push(new Vector2(j, this.y), new Vector2(j, this.y - 1));
      }
    }

    return ns;
  }
}