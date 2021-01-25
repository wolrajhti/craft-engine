import { Rect } from "./rect";

export class Cell {
  constructor(
    readonly token: string,
    public rectX = new Rect(),
    public rectY = new Rect(),
  ) { }
  cutX(r1 = this.rectX, r2 = this.rectY): Rect[] {
    if (r1.w === 1) {
      return [];
    }
    if (r1.x < r2.x) {
      if (r2.x < r1.x + r1.w - 1) {
        //      2
        // [111]2[111]
        //      2
        const head = new Rect(r1.x, r1.y, r2.x - r1.x, 1);
        const tail = new Rect(r2.x + 1, r1.y, r1.w - (r2.x - r1.x + 1), 1);
        return [head, tail];
      } else {
        //      2
        // [111]2
        //      2
        const head = new Rect(r1.x, r1.y, r1.w - 1, 1);
        return [head];
      }
    } else {
      // 2
      // 2[111]
      // 2
      const tail = new Rect(r1.x + 1, r1.y, r1.w - 1, 1);
      return [tail];
    }
  }
  cutY(r1 = this.rectX, r2 = this.rectY): Rect[] {
    return this.cutX(r2.turnLeft(), r1.turnLeft())
      .map(r => r.turnRight());
  }
}