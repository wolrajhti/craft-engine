import { Grid } from './grid';

let input: string[];

input = [
  'XXX ',
  'X   ',
  '    ',
  ' XXX',
];

// input = [
//   'XXXXXX    X     X',
//   'X        XXX     ',
//   '  X   X          ',
//   '  XX XX    XXXX  ',
//   '  XX        XXX  ',
//   '     XX          ',
//   '  XXXXX          ',
//   '              XXX',
// ];

input = [
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

// input = [
//   'XXXXXXXXXXXXXXXXXXX',
//   'X   XXXXXXXXXXXXXXX',
//   'XX XXXXXXXXXXXXXXXX',
//   'XX       XXXXXXXXXX',
//   'XX XXXXX XXXXXXXXXX',
//   'X   XXXX XXXXXXXXXX',
//   'XXXXXXXX          X',
//   'X   XXXX XXXXXXXXXX',
//   'XX XXXXX XXXXXXXXXX',
//   'XX       XXXXXXXXXX',
//   'XX XXXXXXXXXXXXXXXX',
//   'X   XXXXXXXXXXXXXXX',
//   'XXXXXXXXXXXXXXXXXXX',
// ];

// input = [
//   'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
//   'X XXXXXXXXXXXXXX                  X',
//   'X XXXXXXX  XXXXX    XXXXXXXX    XXX',
//   'X  XXXX    XXXXX    XXXXXXXX  XXXXX',
//   'X   X      XXXXX    XXXXXXXXXXXXXXX',
//   'X    XXXXX XXXXX    XXXXXXXXXXXXXXX',
//   'XX    XXXX XXX         XXXXX  XXXXX',
//   'XX     XXX XXXXXXXXXX  XXXXX XXXXXX',
//   'XXX    XXX     XXXXXX  XXXX    XXXX',
//   'XXXX   XXX     XXXXXX  XXXXX XX XXX',
//   'XXXXX          XXXXXX   XXXX    XXX',
//   'XXXXXX    XXXXXXXXXXXXX         XXX',
//   'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
// ];

// input = [
//   'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
//   'X                                 X',
//   'X                   XXXXXXXX      X',
//   'X                   XXXXXXXX      X',
//   'X                   XXXXXXXXXXXXXXX',
//   'X                   XXXXXXXXXXXXXXX',
//   'XX                              XXX',
//   'XX     XXX                      XXX',
//   'XXX    XXX     XXXXXX           XXX',
//   'XXX            XXXXXX           XXX',
//   'XX             XXXXXXX          XXX',
//   'XX        XXXXXXXXXXXX          XXX',
//   'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
// ];

const g = new Grid();
g.init(input);

console.log('INPUT GRID (I)');
g.draw();

console.log('RAW HORIZONTAL LINES (H = f(I))');
g.drawRectX();

console.log('RAW VERTICAL LINES (V = g(I))');
g.drawRectY();

const rects = g.process();

console.log('OPTIMIZED LINES (L = h(H, V))');
g.draw(' ', rects);

// const mergeTopLeft = (r1: Rect, r2: Rect): Rect[] => {
//   if (r1.x === r2.x && r1.y === r2.y - r1.h) {
//     if (r1.w < r2.w && r2.h < r1.w) {
//       // 111       111
//       // 111    -> 111
//       // 222222    111222
//       return [
//         new Rect(r1.x, r1.y, r1.w, r1.h + r2.h),
//         new Rect(r1.x + r1.w, r2.y, r2.w - r1.w, r2.h)
//       ];
//     } else if (r1.w === r2.w) {
//       // 111111    222222
//       // 111111 -> 222222
//       // 222222    222222
//       return [new Rect(r1.x, r1.y, r1.w, r1.h + r2.h)];
//     }
//   }
//   return [];
// }

// const cases: [(r: Rect) => Rect, (r: Rect) => Rect][] = [
//   [
//     (r: Rect) => r,
//     (r: Rect) => r
//   ],
//   [
//     (r: Rect) => r.mirrorX(),
//     (r: Rect) => r.mirrorX()
//   ],
//   [
//     (r: Rect) => r.mirrorY(),
//     (r: Rect) => r.mirrorY()
//   ],
//   [
//     (r: Rect) => r.mirrorX().mirrorY(),
//     (r: Rect) => r.mirrorY().mirrorX()
//   ],
//   [
//     (r: Rect) => r.turnLeft(),
//     (r: Rect) => r.turnRight()
//   ],
//   [
//     (r: Rect) => r.turnLeft().mirrorX(),
//     (r: Rect) => r.mirrorX().turnRight()
//   ],
//   [
//     (r: Rect) => r.turnLeft().mirrorY(),
//     (r: Rect) => r.mirrorY().turnRight()
//   ],
//   [
//     (r: Rect) => r.turnLeft().mirrorX().mirrorY(),
//     (r: Rect) => r.mirrorY().mirrorX().turnRight()
//   ],
// ];

// const optimize = () => {
//   let i: number, j: number;
//   let r1: Rect, r2: Rect, merged: Rect[];

//   i = 0;
//   while (i < validRects.length) {
//     j = 0;
//     r1 = validRects[i];
//     while (j < validRects.length) {
//       if (i !== j) {
//         // console.log(i, j);
//         r2 = validRects[j];
//         for (const [send, receive] of cases) {
//           merged = mergeTopLeft(send(r1), send(r2));
//           if (merged.length) {
//             // console.log('merging', i.toString(16), j.toString(16));
//             validRects.splice(Math.max(i, j), 1);
//             validRects.splice(Math.min(i, j), 1);
//             validRects.push(...merged.map(r => receive(r)));
//             // draw();
//             i = -1;
//             break;
//           }
//         }
//       }
//       if (i === -1) {
//         break;
//       }
//       j++;
//     }
//     i++;
//   }
// }

// optimize();

// console.log('OPTIMIZED RECTANGLES (R = i(L))');
// g.draw(validRects);

// console.log(`FINAL RESULT\nfrom ${count} empty cells to ${validRects.length} rectangles (-${(100 * (1 - validRects.length / count)).toFixed(1)}%)`);

// function t(r: Rect) {
//   if (!r.mirrorX().mirrorX().equals(r)) {
//     console.log('mirrorX');
//   }
//   if (!r.mirrorY().mirrorY().equals(r)) {
//     console.log('mirrorY');
//   }
//   if (!r.mirrorX().mirrorY().mirrorX().mirrorY().equals(r)) {
//     console.log('mirrorXY');
//   }
//   if (!r.turnLeft().turnRight().equals(r)) {
//     console.log('mirror');
//   }
//   if (!r.turnLeft().mirrorX().mirrorX().turnRight().equals(r)) {
//     console.log('mirrormirrorX');
//   }
//   if (!r.turnLeft().mirrorY().mirrorY().turnRight().equals(r)) {
//     console.log('mirrormirrorY');
//   }
//   if (!r.turnLeft().mirrorX().mirrorY().mirrorX().mirrorY().turnRight().equals(r)) {
//     console.log('mirrormirrorXY');
//   }
// }

// t(new Rect(Math.random(), Math.random(), Math.random(), Math.random()));
// t(new Rect(Math.random(), Math.random(), Math.random(), Math.random()));
// t(new Rect(Math.random(), Math.random(), Math.random(), Math.random()));
// t(new Rect(Math.random(), Math.random(), Math.random(), Math.random()));
// t(new Rect(Math.random(), Math.random(), Math.random(), Math.random()));
// t(new Rect(Math.random(), Math.random(), Math.random(), Math.random()));
// t(new Rect(Math.random(), Math.random(), Math.random(), Math.random()));
// t(new Rect(Math.random(), Math.random(), Math.random(), Math.random()));
// t(new Rect(Math.random(), Math.random(), Math.random(), Math.random()));
// t(new Rect(Math.random(), Math.random(), Math.random(), Math.random()));
// t(new Rect(Math.random(), Math.random(), Math.random(), Math.random()));
// t(new Rect(Math.random(), Math.random(), Math.random(), Math.random()));
// t(new Rect(Math.random(), Math.random(), Math.random(), Math.random()));
