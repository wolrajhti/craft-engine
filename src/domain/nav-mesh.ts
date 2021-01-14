// tsc src/domain/nav-mesh.ts --downlevelIteration && node src/domain/nav-mesh.js

class Rect {
  constructor(
    public x = 0,
    public y = 0,
    public w = 0,
    public h = 0,
  ) {
  }
  mirror(): Rect {
    return new Rect(this.y, this.x, this.h, this.w);
  }
}

class Cell {
  constructor(
    public rectX = new Rect(),
    public rectY = new Rect(),
  ) { }
  score(): number {
    return Math.abs(this.rectX.w - this.rectY.h);
  }
  private _cutX(): Rect[] {
    if (this.rectX.w === 1) {
      return [];
    }
    if (this.rectX.x < this.rectY.x) {
      if (this.rectY.x < this.rectX.x + this.rectX.w - 1) {
        //      Y
        // [XXX]Y[XXX]
        //      Y
        const head = new Rect(this.rectX.x, this.rectX.y, this.rectY.x - this.rectX.x, 1);
        const tail = new Rect(this.rectY.x + 1, this.rectX.y, this.rectX.w - (this.rectY.x - this.rectX.x + 1), 1);
        for (let x = 0; x < head.w; x++) {
          (cellAt(head.x + x, head.y) as Cell).rectX = head;
        }
        for (let x = 0; x < tail.w; x++) {
          (cellAt(tail.x + x, tail.y) as Cell).rectX = tail;
        }
        return [head, tail];
      } else {
        //      Y
        // [XXX]Y
        //      Y
        const head = new Rect(this.rectX.x, this.rectX.y, this.rectX.w - 1, 1);
        for (let x = 0; x < head.w; x++) {
          (cellAt(head.x + x, head.y) as Cell).rectX = head;
        }
        return [head];
      }
    } else {
      // Y
      // Y[XXX]
      // Y
      const tail = new Rect(this.rectX.x + 1, this.rectX.y, this.rectX.w - 1, 1);
      for (let x = 0; x < tail.w; x++) {
        (cellAt(tail.x + x, tail.y) as Cell).rectX = tail;
      }
      return [tail];
    }
  }
  private _cutY(): Rect[] {
    if (this.rectY.h === 1) {
      return [];
    }
    if (this.rectY.y < this.rectX.y) {
      if (this.rectX.y < this.rectY.y + this.rectY.h - 1) {
        //   [Y]
        // XXXXXXX
        //   [Y]
        const head = new Rect(this.rectY.x, this.rectY.y, 1, this.rectX.y - this.rectY.y);
        const tail = new Rect(this.rectY.x, this.rectX.y + 1, 1, this.rectY.h - (this.rectX.y - this.rectY.y + 1));
        for (let y = 0; y < head.h; y++) {
          (cellAt(head.x, head.y + y) as Cell).rectY = head;
        }
        for (let y = 0; y < tail.h; y++) {
          (cellAt(tail.x, tail.y + y) as Cell).rectY = tail;
        }
        return [head, tail];
      } else {
        //   [Y]
        // XXXXXXX
        const head = new Rect(this.rectY.x, this.rectY.y, 1, this.rectY.h - 1);
        for (let y = 0; y < head.h; y++) {
          (cellAt(head.x, head.y + y) as Cell).rectY = head;
        }
        return [head];
      }
    } else {
      // XXXXXXX
      //   [Y]
      const tail = new Rect(this.rectY.x, this.rectY.y + 1, 1, this.rectY.h - 1);
      for (let y = 0; y < tail.h; y++) {
        (cellAt(tail.x, tail.y + y) as Cell).rectY = tail;
      }
      return [tail];
    }
  }
  cut() {
    if (this.rectX.w < this.rectY.h) {
      rects.delete(this.rectX);
      const newRects = this._cutX();
      // console.log([
      //   'cutX',
      //   this,
      //   ...newRects
      // ]);
      newRects.forEach(newRect => rects.add(newRect));
      return [this.rectX, this._cutX()];
    } else {
      rects.delete(this.rectY);
      const newRects = this._cutY();
      // console.log([
      //   'cutY',
      //   this,
      //   ...newRects
      // ]);
      newRects.forEach(newRect => rects.add(newRect));
    }
  }
}

const cells = new Map<number, Map<number, Cell>>();

const cellAt = (x: number, y: number): Cell | undefined => {
  if (cells.has(x) && cells.get(x)?.has(y)) {
    return cells.get(x)?.get(y);
  }
};

const setCellAt = (x: number, y: number, cell: Cell): void => {
  if (!cells.has(x)) {
    cells.set(x, new Map());
  }
  cells.get(x)?.set(y, cell);
}

const rects = new Set<Rect>();

const map = '' + 
  'X    X     X' +
  'X    X      ' +
  '  XXXXX     ' +
  '           X' +
  '';

// const map = '' + 
//   'X555555555 X' +
//   'X6666666666 ' +
//   '34XXXXX22222' +
//   '11111111111X' +
//   '';

// const map = '' +
//   'X XX' +
//   'X  X' +
//   '    ' +
//   '';

const width = (): number => {
  return 12;
};

const height = (): number => {
  return 4;
};

const isEmpty = (x: number, y: number): boolean => {
  return map[y * width() + x] === ' ';
};

// setup cells
for (let x = 0; x < width(); x++) {
  for (let y = 0; y < height(); y++) {
    if (isEmpty(x, y)) {
      // init new cell
      const cell = new Cell(
        new Rect(x, y, 1, 1),
        new Rect(x, y, 1, 1)
      );
      setCellAt(x, y, cell);
      // update rectX
      const cellX = cellAt(x - 1, y);
      if (cellX) {
        cell.rectX = cellX.rectX;
        cell.rectX.w++;
      } else {
        rects.add(cell.rectX);
      }
      // update rectY
      const cellY = cellAt(x, y - 1);
      if (cellY) {
        cell.rectY = cellY.rectY;
        cell.rectY.h++;
      } else {
        rects.add(cell.rectY);
      }
    }
  }  
}
// setup todos
const todos: Cell[] = [];
cells.forEach(row => row.forEach(cell => todos.push(cell)));

console.log(rects.size, todos.length);

// while
while (todos.length) {
  todos.sort((c1, c2) => c1.score() - c2.score());
  todos.pop()?.cut();
}

const validRects = [...rects];

console.log(validRects);

const mergeX = (r1: Rect, r2: Rect): Rect[] => {
  if (r1.x === r2.x) {
    if (r1.y === r2.y + r2.h + 1) {
      if (r1.w < r2.w) {
        if (r2.h < r1.w) {
          // 222222    111222
          // 111    -> 111
          // 111       111
          return [
            new Rect(r2.x, r2.y, r1.w, r1.h + r2.h),
            new Rect(r2.x + r1.w, r2.y, r2.w - r1.w, r2.h)
          ];
        }
      } else if (r1.w === r2.w) {
        // 222222    222222
        // 111111 -> 222222
        // 111111    222222
        return [new Rect(r2.x, r2.y, r2.w, r1.h + r2.h)];
      } else if (r1.h < r2.w) {
        // 222       222
        // 222    -> 222
        // 111111    222111
        return [
          new Rect(r2.x, r2.y, r2.w, r1.h + r2.h),
          new Rect(r1.x + r2.w, r1.y, r1.w - r2.w, r1.h)
        ];
      }
    } else if (r1.y + r1.h + 1 === r2.y) {
      if (r1.w < r2.w) {
        if (r2.h < r1.w) {
          // 111       111
          // 111    -> 111
          // 222222    111222
          return [
            new Rect(r1.x, r1.y, r1.w, r1.h + r2.h),
            new Rect(r2.x + r1.w, r2.y, r2.w - r1.w, r2.h)
          ];
        }
      } else if (r1.w === r2.w) {
        // 111111    111111
        // 222222 -> 111111
        // 222222    111111
        return [new Rect(r1.x, r1.y, r1.w, r1.h + r2.h)];
      } else if (r1.h < r2.w) {
        // 111111    222111
        // 222    -> 222
        // 222       222
        return [
          new Rect(r1.x, r1.y, r2.w, r2.h + r1.h),
          new Rect(r1.x + r2.w, r1.y, r1.w - r2.w, r1.h)
        ];
      }
    }
  } else if (r1.x + r1.w === r2.x + r2.h) {
    if (r1.y === r2.y + r2.h + 1) {
      if (r1.w < r2.w) {
        if (r2.h < r1.w) {
          // 222222    222111
          //    111 ->    111
          //    111       111
          return [
            new Rect(r2.x, r2.y, r2.w - r1.w, r2.h),
            new Rect(r1.x, r2.y, r1.w, r1.h + r2.h)
          ];
        }
      } else if (r1.w === r2.w) {
        // 222222    222222
        // 111111 -> 222222
        // 111111    222222
        return [new Rect(r2.x, r2.y, r2.w, r1.h + r2.h)];
      } else if (r1.h < r2.w) {
        //    222       222
        //    222 ->    222
        // 111111    111222
        return [
          new Rect(r2.x, r2.y, r2.w, r1.h + r2.h),
          new Rect(r1.x, r1.y, r1.w - r2.w, r1.h)
        ];
      }
    } else if (r1.y + r1.h + 1 === r2.y) {
      if (r1.w < r2.w) {
        if (r2.h < r1.w) {
          //    111       111
          //    111 ->    111
          // 222222    222111
          return [
            new Rect(r1.x, r1.y, r1.w, r1.h + r2.h),
            new Rect(r2.x, r2.y, r2.w - r1.w, r1.h)
          ];
        }
      } else if (r1.w === r2.w) {
        // 111111    111111
        // 222222 -> 111111
        // 222222    111111
        return [new Rect(r1.x, r1.y, r1.w, r1.h + r2.h)];
      } else if (r1.h < r2.w) {
        // 111111    111222
        //    222 ->    222
        //    222       222
        return [
          new Rect(r1.x, r1.y, r1.w - r2.w, r1.h),
          new Rect(r1.x, r1.y, r2.w, r1.h + r2.h)
        ];
      }
    }
  }
  return [];
}

let i = 0;
while (i < validRects.length - 1) {
  let j = i + 1;
  let r1 = validRects[i];
  while (j < validRects.length) {
    let r2 = validRects[j];
    let merged = mergeX(r1, r2);
    if (merged.length) {
      validRects.splice(j, 1);
      validRects.splice(i, 1);
      validRects.push(...merged);
      i = -1;
      break;
    } else {
      merged = mergeX(r1.mirror(), r2.mirror());
      if (merged.length) {
        validRects.splice(j, 1);
        validRects.splice(i, 1);
        validRects.push(...merged.map(r => r.mirror()));
        i = -1;
        break;
      }
    }
    j++;
  }
  i++;
}

console.log(validRects);