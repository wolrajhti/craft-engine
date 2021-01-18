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
  mirrorX(): Rect {
    return new Rect(-this.x - this.w, this.y, this.w, this.h);
  }
  mirrorY(): Rect {
    return new Rect(this.x, -this.y - this.h, this.w, this.h);
  }
  toString(): string {
    return `${this.x}, ${this.y}, ${this.w}, ${this.h}`;
  }
  contains(x: number, y: number): boolean {
    return this.x <= x && x < this.x + this.w &&
      this.y <= y && y < this.y + this.h;
  }
  equals(other: Rect): boolean {
    return this.x === other.x &&
      this.y === other.y &&
      this.w === other.w &&
      this.h === other.h;
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

// const map = '' + 
//   'X    X     X' +
//   'X    X      ' +
//   '  XXXXX     ' +
//   '           X' +
//   '';

// const map = '' + 
// 'X1111X33333X' +
// 'X2222X444444' +
// '67XXXXX55555' +
// '00000000000X' +
// '';

// const map = '' + 
// 'X2222X33333X' +
// 'X2222X333334' +
// '55XXXXX11111' +
// '00000000000X' +
// '';

const map = '' + 
'XXXXXX    X     X' +
'X        XXX     ' +
'  X   X          ' +
'  XX XX    XXXX  ' +
'  XX        XXX  ' +
'     XX          ' +
'  XXXXX          ' +
'              XXX' +
'';

// const map = '' + 
// 'XXXXXX    X66666X' +
// 'X22222222XXX77777' +
// '  X333X          ' +
// '  XX8XX    XXXX  ' +
// '  XX44444444XXX  ' +
// '00000XX          ' +
// '9 XXXXX5555555555' +
// '11111111111111XXX' +
// '';

const width = (): number => {
  return 17; // 12
};

const height = (): number => {
  return 8; // 4
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

const mergeTopLeft = (r1: Rect, r2: Rect): Rect[] => {
  if (r1.x === r2.x && r1.y === r2.y - r1.h) {
    if (r1.w < r2.w && r2.h < r1.w) {
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

const cases: [(r: Rect) => Rect, (r: Rect) => Rect][] = [
  [
    (r: Rect) => r,
    (r: Rect) => r
  ],
  [
    (r: Rect) => r.mirrorX(),
    (r: Rect) => r.mirrorX()
  ],
  [
    (r: Rect) => r.mirrorY(),
    (r: Rect) => r.mirrorY()
  ],
  [
    (r: Rect) => r.mirrorX().mirrorY(),
    (r: Rect) => r.mirrorY().mirrorX()
  ],
  [
    (r: Rect) => r.mirror(),
    (r: Rect) => r.mirror()
  ],
  [
    (r: Rect) => r.mirror().mirrorX(),
    (r: Rect) => r.mirrorX().mirror()
  ],
  [
    (r: Rect) => r.mirror().mirrorY(),
    (r: Rect) => r.mirrorY().mirror()
  ],
  [
    (r: Rect) => r.mirror().mirrorX().mirrorY(),
    (r: Rect) => r.mirrorY().mirrorX().mirror()
  ],
];

let i: number, j: number;
let r1: Rect, r2: Rect, merged: Rect[];

i = 0;
while (i < validRects.length - 1) {
  let j = i + 1;
  let r1 = validRects[i];
  while (j < validRects.length) {
    let r2 = validRects[j];
    for (const [send, receive] of cases) {
      merged = mergeTopLeft(send(r1), send(r2));
      if (merged.length) {
        validRects.splice(j, 1);
        validRects.splice(i, 1);
        validRects.push(...merged.map(r => receive(r)));
        i = -1;
        break;
      }
    }
    if (i === -1) {
      break;
    }
    j++;
  }
  i++;
}

console.log(validRects);

console.log(validRects.length);

function t(r: Rect) {
  if (!r.mirrorX().mirrorX().equals(r)) {
    console.log('mirrorX');
  }
  if (!r.mirrorY().mirrorY().equals(r)) {
    console.log('mirrorY');
  }
  if (!r.mirrorX().mirrorY().mirrorX().mirrorY().equals(r)) {
    console.log('mirrorXY');
  }
  if (!r.mirror().mirror().equals(r)) {
    console.log('mirror');
  }
  if (!r.mirror().mirrorX().mirrorX().mirror().equals(r)) {
    console.log('mirrormirrorX');
  }
  if (!r.mirror().mirrorY().mirrorY().mirror().equals(r)) {
    console.log('mirrormirrorY');
  }
  if (!r.mirror().mirrorX().mirrorY().mirrorX().mirrorY().mirror().equals(r)) {
    console.log('mirrormirrorXY');
  }
}

t(new Rect(Math.random(), Math.random(), Math.random(), Math.random()));
t(new Rect(Math.random(), Math.random(), Math.random(), Math.random()));
t(new Rect(Math.random(), Math.random(), Math.random(), Math.random()));
t(new Rect(Math.random(), Math.random(), Math.random(), Math.random()));
t(new Rect(Math.random(), Math.random(), Math.random(), Math.random()));
t(new Rect(Math.random(), Math.random(), Math.random(), Math.random()));
t(new Rect(Math.random(), Math.random(), Math.random(), Math.random()));
t(new Rect(Math.random(), Math.random(), Math.random(), Math.random()));
t(new Rect(Math.random(), Math.random(), Math.random(), Math.random()));
t(new Rect(Math.random(), Math.random(), Math.random(), Math.random()));
t(new Rect(Math.random(), Math.random(), Math.random(), Math.random()));
t(new Rect(Math.random(), Math.random(), Math.random(), Math.random()));
t(new Rect(Math.random(), Math.random(), Math.random(), Math.random()));


const draw = () => {
  let result = '';
  for (let y = 0; y < height(); y++) {
    for (let x = 0; x < width(); x++) {
      const rect = validRects.findIndex(rect => rect.contains(x, y));
      if (validRects.length > 16) {
        if (rect !== -1) {
          result += rect.toString(16).padStart(2, ' ');
        } else {
          result += 'XX';
        }
      } else if (rect !== -1) {
        result += rect.toString(16);
      } else {
        result += 'X';
      }
    }
    result += '\n';
  }
  console.log(result);
}

draw();