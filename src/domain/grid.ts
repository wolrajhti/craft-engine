import { Rect } from './rect';

interface EmptyCase {}
interface SymCase {
  transform(r: Rect): Rect;
}
interface ASymCase extends SymCase {
  send(r: Rect): Rect;
  receive(r: Rect): Rect;
}
type Case = EmptyCase | SymCase | ASymCase;

const CASES: Case[] = [
  {},
  {
    transform: r => r.mirrorX()
  },
  {
    transform: r => r.mirrorY()
  },
  {
    transform: r => r.mirrorX().mirrorY()
  },
  {
    send: r => r.turnLeft(),
    receive: r => r.turnRight(),
  },
  {
    send: r => r.turnLeft(),
    receive: r => r.turnRight(),
    transform: r => r.mirrorX()
  },
  {
    send: r => r.turnLeft(),
    receive: r => r.turnRight(),
    transform: r => r.mirrorY()
  },
  {
    send: r => r.turnLeft(),
    receive: r => r.turnRight(),
    transform: r => r.mirrorX().mirrorY()
  }
];

export class Grid {
  private width = 0;
  private _tokens: string[] = [];
  init(input: string[]): void {
    for (let y = 0; y < input.length; y++) {
      if (y === 0) {
        this.width = input[y].length;
      } else if (this.width !== input[y].length) {
        throw new Error('wrong width');
      }
      for (let x = 0; x < input[y].length; x++) {
        this._tokens.push(input[y][x]);
      }  
    }
  }
  i(x: number, y: number): number {
    return y * this.width + x;
  }
  private _y(i: number): number {
    return (i - this._x(i)) / this.width;
  }
  private _x(i: number): number {
    return i % this.width;
  }
  buildRectXs(): Rect[] {
    const rectXs: Rect[] = [];
    this._tokens.forEach((token, i) => {
      if (i % this.width && this._tokens[i - 1] === token) {
        rectXs.push(rectXs[i - 1]);
        rectXs[i - 1].w++;
      } else {
        rectXs.push(new Rect(this._x(i), this._y(i), 1, 1));
      }
    });
    return rectXs;
  }
  buildRectYs(): Rect[] {
    const rectYs: Rect[] = [];
    this._tokens.forEach((token, i) => {
      if (i >= this.width && this._tokens[i - this.width] === token) {
        rectYs.push(rectYs[i - this.width]);
        rectYs[i - this.width].h++;
      } else {
        rectYs.push(new Rect(this._x(i), this._y(i), 1, 1));
      }
    });
    return rectYs;
  }
  private _scoreOfRect(rects: Rect[], rect: Rect): number {
    let score = rect.area() * rect.area();
    for (let x = 0; x < rect.w; x++) {
      for (let y = 0; y < rect.h; y++) {
        score -= rects[this.i(rect.x + x, rect.y + y)].area();
      }
    }
    return score;
  }
  private _scoreOfCell(rectXs: Rect[], rectYs: Rect[], i: number): number {
    return Math.abs(this._scoreOfRect(rectYs, rectXs[i]) - this._scoreOfRect(rectXs, rectYs[i]));
  }
  private _cutX(r1: Rect, r2: Rect): Rect[] {
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
  private _cutY(r1: Rect, r2: Rect): Rect[] {
    return this._cutX(r2.turnLeft(), r1.turnLeft())
      .map(r => r.turnRight());
  }
  private _cut(rectXs: Rect[], rectYs: Rect[], i: number): Rect {
    const rectX = rectXs[i];
    const rectY = rectYs[i];
    const xLtY = this._scoreOfRect(rectYs, rectX) < this._scoreOfRect(rectXs, rectY);
    const xTopOrBottom = rectX.x < rectY.x &&
      rectY.x < rectX.x + rectX.w - 1 &&
      (rectX.y === rectY.y || rectX.y === rectY.y + rectY.h - 1);
    const yLeftOrRight = rectY.y < rectX.y &&
      rectX.y < rectY.y + rectY.h - 1 &&
      (rectY.x === rectX.x || rectY.x === rectX.x + rectX.w - 1);

    if (xLtY && xTopOrBottom || !xLtY && !yLeftOrRight) {
      this._cutY(rectX, rectY).forEach(r => {
        for (let y = 0; y < r.h; y++) {
          rectYs[this.i(r.x, r.y + y)] = r;
        }
      });
      return rectY;
    } else {
      this._cutX(rectX, rectY).forEach(r => {
        for (let x = 0; x < r.w; x++) {
          rectXs[this.i(r.x + x, r.y)] = r;
        }
      });
      return rectX;
    }
  }
  // TODO merge width drawAll when rects.length === this._tokens.length is always true
  draw(rects: Rect[] = [], token = ' '): void {
    this.drawAll(rects.filter((r, i) => this._tokens[i] === token), token);
  }
  // TODO merge with draw when rects.length === this._tokens.length is always true
  drawAll(rects: Rect[] = [], token = ' '): void {
    rects = [...new Set(rects)];
    let result = '';
    const padding = rects.length > 16 ? 2 : 1;
    for (let i = 0; i < this._tokens.length; i++) {
      if (this._tokens[i] === token) {
        const index = rects.findIndex(rect => rect.contains(this._x(i), this._y(i)));
        if (index !== -1) {
          result += ' ' + index.toString(16).padStart(padding, ' ') + ' ';
        } else {
          result += ' ' + ''.padStart(padding, ' ') + ' ';
        }
      } else {
        result += ' ' + '■'.padStart(padding, '■') + ' ';
      }
      if (!((i + 1) % this.width)) {
        result += '\n';
      }
    }
    console.log(rects.length, 'rectangles');
    rects.forEach((rect, i) => {
      if ((result.match(new RegExp(' ' + i.toString(16) + ' ', 'g')) || []).length !== rect.area()) {
        console.log('invalid', i.toString(16), rect);
      }
    });
    console.log(result);
  }
  chooseLines(rectXs: Rect[], rectYs: Rect[]): Rect[] {
    const todos: number[] = [];
    this._tokens.forEach((tkn, i) => {
      todos.push(i);
    });
    const cuttedRects = new Set<Rect>();
    while (todos.length) {
      todos.sort((i, j) => this._scoreOfCell(rectXs, rectYs, i) - this._scoreOfCell(rectXs, rectYs, j));
      cuttedRects.add(this._cut(rectXs, rectYs, todos.pop() as number));
    }
    return this._tokens.map((tkn, i) => {
      if (cuttedRects.has(rectXs[i])) {
        return rectYs[i];
      } else {
        return rectXs[i];
      }
    });
  }
  private _applyCase(c: Case, rects: Rect[], i: number, j: number): boolean {
    let r1 = rects[i];
    let r2 = rects[j];
    if (typeof (c as ASymCase).send === 'function') {
      r1 = (c as ASymCase).send(r1);
      r2 = (c as ASymCase).send(r2);
    }
    if (typeof (c as SymCase).transform === 'function') {
      r1 = (c as SymCase).transform(r1);
      r2 = (c as SymCase).transform(r2);
    }
    let merged = Rect.MergeTopLeft(r1, r2);
    if (merged.length) {
      // console.log('merging', i.toString(16), j.toString(16));
      if (typeof (c as SymCase).transform === 'function') {
        merged = merged.map(r => (c as SymCase).transform(r));
      }
      if (typeof (c as ASymCase).receive === 'function') {
        merged = merged.map(r => (c as ASymCase).receive(r));
      }
      merged.forEach(r => {
        for (let x = r.x; x < r.x + r.w; x++) {
          for (let y = r.y; y < r.y + r.h; y++) {
            rects[this.i(x, y)] = r;
          }
        }
      });
      return true;
    }
    return false;
  }
  // TODO must return an array of size this.width * this.height
  mergeRects(rects: Rect[]) {
    let i = 0;

    while (i !== -1 && i < rects.length) {
      console.log('i', i);
      for (const n of this.neighboors(rects, rects[i])) {
        // console.log('\tn', n);
        if (this._tokens[i] === this._tokens[n]) {
          for (const c of CASES) {
            if (this._applyCase(c, rects, i, n)) {
              console.log('MERGED !');
              i = -1;
              break;
            }
          }
          if (i === -1) {
            break;
          }
        }
      }
      if (i === -1) {
        console.log('reset');
        i = 0;
      } else {
        const j = i;
        i = this.next(rects[i]);
        console.log(i, j);
      }
    }
  }
  next(r: Rect): number {
    if (r.x + r.w < this.width) {
      return this.i(r.x + r.w, r.y);
    }
    if (r.y + r.h < this._tokens.length / this.width) {
      return this.i(0, r.y + 1);
    }
    return -1;
  }
  neighboors(rects: Rect[], r: Rect): number[] {
    let nIndex: number, n: Rect;
    const ns: number[] = []

    // left
    if (r.x + r.w < this.width) {
      let i = r.y;
      while (i < r.y + r.h) {
        nIndex = this.i(r.x + r.w, i);
        ns.push(nIndex);
        n = rects[nIndex];
        i = n.y + n.h;
      }
    }
    // bottom
    if (r.y + r.h < this._tokens.length / this.width) {
      let i = r.x + r.w - 1;
      while (r.x <= i) {
        nIndex = this.i(i, r.y + r.h);
        ns.push(nIndex);
        n = rects[nIndex];
        i = n.x - 1;
      }
    }
    // right
    if (0 < r.x) {
      let i = r.y + r.h - 1;
      while (r.y <= i) {
        nIndex = this.i(r.x - 1, i);
        ns.push(nIndex);
        n = rects[nIndex];
        i = n.y - 1;
      }
    }
    // top
    if (0 < r.y) {
      let i = r.x;
      while (i < r.x + r.w) {
        nIndex = this.i(i, r.y - 1);
        ns.push(nIndex);
        n = rects[nIndex];
        i = n.x + n.w;
      }
    }

    return ns;
  }
}
