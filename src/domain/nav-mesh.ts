
let grid: string[];

grid = [
  'XXXXXX    X     X',
  'X        XXX     ',
  '  X   X          ',
  '  XX XX    XXXX  ',
  '  XX        XXX  ',
  '     XX          ',
  '  XXXXX          ',
  '              XXX',
];

grid = [
  'XXXXXXXXXXXXXXXXXX',
  'XXXXXXXXXXX      X',
  'X XXXXXXX      XXX',
  'X  XXXX      XXXXX',
  'X   X      XXXXXXX',
  'X    XXXXXXXXXXXXX',
  'XX    XXXX   XXXXX',
  'XX     XXXX XXXXXX',
  'XXX    XXX     XXX',
  'XXXX   XXX  XX XXX',
  'XXXXX  XXX     XXX',
  'XXXXXX XX      XXX',
  'XXXXXXXXXXXXXXXXXX',
];

// grid = [
//   'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
//   'X XXXXXXXXXXXXXX                  X',
//   'X XXXXXXX  XXXXX    XXXXXXXX    XXX',
//   'X  XXXX    XXXXX    XXXXXXXX  XXXXX',
//   'X   X      XXXXX    XXXXXXXXXXXXXXX',
//   'X    XXXXX XXXXX    XXXXXXXXXXXXXXX',
//   'XX    XXXX XXX         XXXXX  XXXXX',
//   'XX     XXX XXXXXXXXXX  XXXXX XXXXXX',
//   'XXX    XXX     XXXXXX  XXXX    XXX',
//   'XXXX   XXX     XXXXXX  XXXXX XX XXX',
//   'XXXXX          XXXXXX   XXXX    XXX',
//   'XXXXXX    XXXXXXXXXXXXX         XXX',
//   'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
// ];

class Rect {
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
  score(): number {
    let score = this.area() * this.area();
    let cell: Cell;
    for (let x = 0; x < this.w; x++) {
      for (let y = 0; y < this.h; y++) {
        cell = cellAt(this.x + x, this.y + y) as Cell;
        if (cell.rectX === this) {
          score -= cell.rectY.area();
        } else {
          score -= cell.rectX.area();
        }
      }
    }
    return score;
  }
}

class Cell {
  constructor(
    public rectX = new Rect(),
    public rectY = new Rect(),
  ) { }
  score(): number {
    return Math.abs(this.rectX.score() - this.rectY.score());
  }
  private _cutX(r1 = this.rectX, r2 = this.rectY): Rect[] {
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
  private _cutY(r1 = this.rectX, r2 = this.rectY): Rect[] {
    return this._cutX(r2.turnLeft(), r1.turnLeft())
      .map(r => r.turnRight());
  }
  cut() {
    let newRects: Rect[];
    if (this.rectX.score() < this.rectY.score()) {
      if (this.rectX.x < this.rectY.x &&
        this.rectY.x < this.rectX.x + this.rectX.w - 1 &&
        (this.rectX.y === this.rectY.y || this.rectX.y === this.rectY.y + this.rectY.h - 1)
      ) {
        rects.delete(this.rectY);
        newRects = this._cutY();
        newRects.forEach(r => {
          for (let y = 0; y < r.h; y++) {
            (cellAt(r.x, r.y + y) as Cell).rectY = r;
          }
        });
      } else {
        rects.delete(this.rectX);
        newRects = this._cutX();
        newRects.forEach(r => {
          for (let x = 0; x < r.w; x++) {
            (cellAt(r.x + x, r.y) as Cell).rectX = r;
          }
        });
      }
    } else {
      if (this.rectY.y < this.rectX.y &&
        this.rectX.y < this.rectY.y + this.rectY.h - 1 &&
        (this.rectY.x === this.rectX.x || this.rectY.x === this.rectX.x + this.rectX.w - 1)
      ) {
        rects.delete(this.rectX);
        newRects = this._cutX();
        newRects.forEach(r => {
          for (let x = 0; x < r.w; x++) {
            (cellAt(r.x + x, r.y) as Cell).rectX = r;
          }
        });
      } else {
        rects.delete(this.rectY);
        newRects = this._cutY();
        newRects.forEach(r => {
          for (let y = 0; y < r.h; y++) {
            (cellAt(r.x, r.y + y) as Cell).rectY = r;
          }
        });
      }
    }
    newRects.forEach(newRect => rects.add(newRect));
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

const width = (): number => {
  return grid[0].length;
};

const height = (): number => {
  return grid.length;
};

const isEmpty = (x: number, y: number): boolean => {
  return grid[y][x] === ' ';
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

const count = todos.length;

let validRects: Rect[] = [];

const draw = () => {
  let result = '';
  const padding = validRects.length > 16 ? 2 : 1;
  for (let y = 0; y < height(); y++) {
    for (let x = 0; x < width(); x++) {
      if (isEmpty(x, y)) {
        // result += ' ' + cellAt(x, y)?.score().toFixed().padStart(padding) + ' ';
        const i = validRects.findIndex(rect => rect.contains(x, y));
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
  console.log(validRects.length, 'rectangles');
  validRects.forEach((rect, i) => {
    if ((result.match(new RegExp(' ' + i.toString(16) + ' ', 'g')) || []).length !== rect.area()) {
      console.log('invalid', i.toString(16), rect);
    }
  });
  console.log(result);
}

console.log('INPUT GRID (I)');
draw();

validRects = [...new Set(todos.map(cell => cell.rectX))];

console.log('RAW HORIZONTAL LINES (H = f(I))');
draw();

validRects = [...new Set(todos.map(cell => cell.rectY))];

console.log('RAW VERTICAL LINES (V = g(I))');
draw();

// while
while (todos.length) {
  todos.sort((c1, c2) => c1.score() - c2.score());
  todos.pop()?.cut();
}

validRects = [...rects];

console.log('OPTIMIZED LINES (L = h(H, V))');
draw();

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
    (r: Rect) => r.turnLeft(),
    (r: Rect) => r.turnRight()
  ],
  [
    (r: Rect) => r.turnLeft().mirrorX(),
    (r: Rect) => r.mirrorX().turnRight()
  ],
  [
    (r: Rect) => r.turnLeft().mirrorY(),
    (r: Rect) => r.mirrorY().turnRight()
  ],
  [
    (r: Rect) => r.turnLeft().mirrorX().mirrorY(),
    (r: Rect) => r.mirrorY().mirrorX().turnRight()
  ],
];

const optimize = () => {
  let i: number, j: number;
  let r1: Rect, r2: Rect, merged: Rect[];

  i = 0;
  while (i < validRects.length) {
    j = 0;
    r1 = validRects[i];
    while (j < validRects.length) {
      if (i !== j) {
        // console.log(i, j);
        r2 = validRects[j];
        for (const [send, receive] of cases) {
          merged = mergeTopLeft(send(r1), send(r2));
          if (merged.length) {
            // console.log('merging', i.toString(16), j.toString(16));
            validRects.splice(Math.max(i, j), 1);
            validRects.splice(Math.min(i, j), 1);
            validRects.push(...merged.map(r => receive(r)));
            // draw();
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

optimize();

console.log('OPTIMIZED RECTANGLES (R = i(L))');
draw();

console.log(`FINAL RESULT\nfrom ${count} empty cells to ${validRects.length} rectangles (-${(100 * (1 - validRects.length / count)).toFixed(1)}%)`);

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
  if (!r.turnLeft().turnRight().equals(r)) {
    console.log('mirror');
  }
  if (!r.turnLeft().mirrorX().mirrorX().turnRight().equals(r)) {
    console.log('mirrormirrorX');
  }
  if (!r.turnLeft().mirrorY().mirrorY().turnRight().equals(r)) {
    console.log('mirrormirrorY');
  }
  if (!r.turnLeft().mirrorX().mirrorY().mirrorX().mirrorY().turnRight().equals(r)) {
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
