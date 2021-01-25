import { Cell } from './cell';
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
  private height = 0;
  private width = 0;
  private _data: Cell[] = [];
  init(input: string[]): void {
    this.height = input.length;
    for (let y = 0; y < input.length; y++) {
      if (y === 0) {
        this.width = input[y].length;
      } else if (this.width !== input[y].length) {
        throw new Error('wrong width');
      }
      for (let x = 0; x < input[y].length; x++) {
        const token = input[y][x];
        // init new cell
        const cell = new Cell(
          token,
          new Rect(x, y, 1, 1),
          new Rect(x, y, 1, 1)
        );
        this.set(cell, x, y);
        // update rectX
        if (x > 0) {
          const cellX = this.get(x - 1, y);
          if (cellX && cellX.token === token) {
            cell.rectX = cellX.rectX;
            cell.rectX.w++;
          }
        }
        // update rectY
        if (y > 0) {
          const cellY = this.get(x, y - 1);
          if (cellY && cellY.token === token) {
            cell.rectY = cellY.rectY;
            cell.rectY.h++;
          }
        }
      }  
    }
  }
  i(x: number, y: number): number {
    return y * this.width + x;
  }
  private _y(i: number): number {
    return Math.floor(i / this.width);
  }
  private _x(i: number): number {
    return i - this._y(i);
  }
  private _set(obj: Cell, x: number, y: number): void {
    this._data[this.i(x, y)] = obj;
  }
  set(obj: Cell, x: number, y: number, w = 1, h = 1): void {
    for (let dx = 0; dx < w; dx++) {
      for (let dy = 0; dy < h; dy++) {
        this._set(obj, x + dx, y + dy);
      }
    }
  }
  get(x: number, y: number): Cell {
    return this._data[this.i(x, y)];
  }
  scoreOfRect(rect: Rect): number {
    let score = rect.area() * rect.area();
    let cell: Cell;
    for (let x = 0; x < rect.w; x++) {
      for (let y = 0; y < rect.h; y++) {
        cell = this.get(rect.x + x, rect.y + y);
        if (cell.rectX === rect) {
          score -= cell.rectY.area();
        } else {
          score -= cell.rectX.area();
        }
      }
    }
    return score;
  }
  scoreOfCell(cell: Cell): number {
    return Math.abs(this.scoreOfRect(cell.rectX) - this.scoreOfRect(cell.rectY));
  }
  cut(cell: Cell): Rect {
    const xLtY = this.scoreOfRect(cell.rectX) < this.scoreOfRect(cell.rectY);
    const xTopOrBottom = cell.rectX.x < cell.rectY.x &&
      cell.rectY.x < cell.rectX.x + cell.rectX.w - 1 &&
      (cell.rectX.y === cell.rectY.y || cell.rectX.y === cell.rectY.y + cell.rectY.h - 1);
    const yLeftOrRight = cell.rectY.y < cell.rectX.y &&
      cell.rectX.y < cell.rectY.y + cell.rectY.h - 1 &&
      (cell.rectY.x === cell.rectX.x || cell.rectY.x === cell.rectX.x + cell.rectX.w - 1);

    if (xLtY && xTopOrBottom || !xLtY && !yLeftOrRight) {
      cell.cutY().forEach(r => {
        for (let y = 0; y < r.h; y++) {
          this.get(r.x, r.y + y).rectY = r;
        }
      });
      return cell.rectY;
    } else {
      cell.cutX().forEach(r => {
        for (let x = 0; x < r.w; x++) {
          this.get(r.x + x, r.y).rectX = r;
        }
      });
      return cell.rectX;
    }
  }
  draw(rects: Rect[] = [], token = ' '): void {
    let result = '';
    const padding = rects.length > 16 ? 2 : 1;
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        if (this._data[this.i(x, y)].token === token) {
          const i = rects.findIndex(rect => rect.contains(x, y));
          if (i !== -1) {
            result += ' ' + i.toString(16).padStart(padding, ' ') + ' ';
          } else {
            result += ' ' + ''.padStart(padding, ' ') + ' ';
          }
        } else {
          result += ' ' + '■'.padStart(padding, '■') + ' ';
        }
      }
      result += '\n';
    }
    console.log(rects.length, 'rectangles');
    rects.forEach((rect, i) => {
      if ((result.match(new RegExp(' ' + i.toString(16) + ' ', 'g')) || []).length !== rect.area()) {
        console.log('invalid', i.toString(16), rect);
      }
    });
    console.log(result);
  }
  drawRectX(token = ' '): void {
    this.draw(
      [...new Set(
        this._data
          .filter(cell => cell.token === token)
          .map(cell => cell.rectX)
      )],
      token
    );
  }
  drawRectY(token = ' '): void {
    this.draw(
      [...new Set(
        this._data
          .filter(cell => cell.token === token)
          .map(cell => cell.rectY)
      )],
      token
    );
  }
  chooseLines(token = ' '): Rect[] {
    const todos = [...this._data.filter(cell => cell.token === token)];
    const cuttedRects = new Set<Rect>();
    while (todos.length) {
      todos.sort((c1, c2) => this.scoreOfCell(c1) - this.scoreOfCell(c2));
      cuttedRects.add(this.cut(todos.pop() as Cell));
    }
    return [
      ...new Set([
        ...this._data
          .filter(cell => cell.token === token && !cuttedRects.has(cell.rectX))
          .map(cell => cell.rectX),
        ...this._data
          .filter(cell => cell.token === token && !cuttedRects.has(cell.rectY))
          .map(cell => cell.rectY)
      ])
    ];
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
      rects.splice(Math.max(i, j), 1);
      rects.splice(Math.min(i, j), 1);
      if (typeof (c as SymCase).transform === 'function') {
        merged = merged.map(r => (c as SymCase).transform(r));
      }
      if (typeof (c as ASymCase).receive === 'function') {
        merged = merged.map(r => (c as ASymCase).receive(r));
      }
      rects.push(...merged);
      return true;
    }
    return false;
  }
  mergeRects(rects: Rect[]) {
    let i: number, j: number;
  
    i = 0;
    while (i < rects.length) {
      j = 0;
      while (j < rects.length) {
        if (i !== j) {
          for (const c of CASES) {
            if (this._applyCase(c, rects, i, j)) {
              i = -1;
              break;
            }
          }
        }
        if (i === -1) {
          break;
        }
        j++;
      }
      i++;
    }
  }
}