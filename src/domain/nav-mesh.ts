// tsc src/domain/nav-mesh.ts --downlevelIteration && node src/domain/nav-mesh.js

class Rect {
  constructor(
    public x = 0,
    public y = 0,
    public w = 0,
    public h = 0,
  ) {
  }
  turnLeft(): Rect {
    return new Rect(-this.y, this.x, this.h, this.w);
  }
  turnRight(): Rect {
    return new Rect(this.y, -this.x, this.h, this.w);
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
  // rm next duplication
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
    let newRects: Rect[];
    if (this.rectX.w < this.rectY.h) {
      rects.delete(this.rectX);
      newRects = this._cutX();
    } else {
      rects.delete(this.rectY);
      newRects = this._cutY();
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

const grid = [
  'XXXXXX    X     X',
  'X        XXX     ',
  '  X   X          ',
  '  XX XX    XXXX  ',
  '  XX        XXX  ',
  '     XX          ',
  '  XXXXX          ',
  '              XXX',
];

// const grid = [
//   'XXXXXXXXXXXXXXXXXX',
//   'XXXXXXXXXXX      X',
//   'X XXXXXXX      XXX',
//   'X  XXXX      XXXXX',
//   'X   X      XXXXXXX',
//   'X    XXXXXXXXXXXXX',
//   'XX    XXXX   XXXXX',
//   'XX     XXXX XXXXXX',
//   'XXX    XXX     XXX',
//   'XXXX   XXX  XX XXX',
//   'XXXXX  XXX     XXX',
//   'XXXXXX XX      XXX',
//   'XXXXXXXXXXXXXXXXXX',
// ];

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

console.log(todos.length, 'empty cells\n');

let validRects: Rect[] = [];

const draw = () => {
  let result = '';
  for (let y = 0; y < height(); y++) {
    for (let x = 0; x < width(); x++) {
      if (isEmpty(x, y)) {
        const rect = validRects.findIndex(rect => rect.contains(x, y));
        if (validRects.length > 16) {
          if (rect !== -1) {
            result += ' ' + rect.toString(16).padStart(2, ' ') + ' ';
          } else {
            result += '    ';
          }
        } else if (rect !== -1) {
          result += ' ' + rect.toString(16) + ' ';
        } else {
          result += '   ';
        }
      } else if (validRects.length > 16) {
        result += ' ■■ ';
      } else {
        result += ' ■ ';
      }
    }
    result += '\n';
  }
  console.log(validRects.length, 'rectangles');
  // console.log(validRects.map((r, i) => [i.toString(16), r]));
  console.log(result);
}

console.log('input');
draw();

validRects = [...new Set(todos.map(cell => cell.rectX))];

console.log('raw horizontal lines');
draw();

validRects = [...new Set(todos.map(cell => cell.rectY))];

console.log('raw vertical lines');
draw();

// while
while (todos.length) {
  todos.sort((c1, c2) => c2.score() - c1.score());
  todos.pop()?.cut();
}

validRects = [...rects];

console.log('optimized lines');
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
  while (i < validRects.length - 1) {
    j = i + 1;
    r1 = validRects[i];
    while (j < validRects.length) {
      // console.log(i, j);
      r2 = validRects[j];
      for (const [send, receive] of cases) {
        merged = mergeTopLeft(send(r1), send(r2));
        if (merged.length) {
          // console.log('merging r1, r2', i, j);
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
      // rm next duplication
      for (const [send, receive] of cases) {
        merged = mergeTopLeft(send(r2), send(r1));
        if (merged.length) {
          // console.log('merging r2, r1', i, j);
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
}

optimize();

console.log('optimized rectangles');
draw();

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
