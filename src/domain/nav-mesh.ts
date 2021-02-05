import { Grid } from './grid';
import { Rect } from './rect';
import { PathfinderGrid } from './pathfinderGrid';
import { PathfinderRects } from './pathfinderRects';

let input: string[];
let sx: number, sy: number, ex: number, ey: number;

input = [
  'XXX ',
  'X   ',
  '    ',
  ' XXX',
];

input = [
  'XXXXXX    X     X',
  'X        XXX     ',
  '  X   X          ',
  '  XX XX    XXXX  ',
  '  XX        XXX  ',
  '     XX          ',
  '  XXXXX          ',
  '              XXX',
];

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

input = [
  'XXXXXXXXXXXXXXXXXXX',
  'X   XXXXXXXXXXXXXXX',
  'XX XXXXXXXXXXXXXXXX',
  'XX       XXXXXXXXXX',
  'XX XXXXX XXXXXXXXXX',
  'X   XXXX XXXXXXXXXX',
  'XXXXXXXX          X',
  'X   XXXX XXXXXXXXXX',
  'XX XXXXX XXXXXXXXXX',
  'XX       XXXXXXXXXX',
  'XX XXXXXXXXXXXXXXXX',
  'X   XXXXXXXXXXXXXXX',
  'XXXXXXXXXXXXXXXXXXX',
];

input = [
  'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
  'X XXXXXXXXXXXXXX                  X',
  'X XXXXXXX  XXXXX    XXXXXXXX    XXX',
  'X  XXXX    XXXXX    XXXXXXXX  XXXXX',
  'X   X      XXXXX    XXXXXXXXXXXXXXX',
  'X    XXXXX XXXXX    XXXXXXXXXXXXXXX',
  'XX    XXXX XXX         XXXXX  XXXXX',
  'XX     XXX XXXXXXXXXX  XXXXX XXXXXX',
  'XXX    XXX     XXXXXX  XXXX    XXXX',
  'XXXX   XXX     XXXXXX  XXXXX XX XXX',
  'XXXXX          XXXXXX   XXXX    XXX',
  'XXXXXX    XXXXXXXXXXXXX         XXX',
  'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
];

sx = 2;
sy = 11;
ex = 33;
ey = 3;
input = [
  'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
  'X                                 X',
  'X                   XXXXXXXX      X',
  'X                   XXXXXXXX      X',
  'X                   XXXXXXXXXXXXXXX',
  'X                   XXXXXXXXXXXXXXX',
  'XX                              XXX',
  'XX     XXX                      XXX',
  'XXX    XXX     XXXXXX           XXX',
  'XXX            XXXXXX           XXX',
  'XX             XXXXXXX          XXX',
  'XX        XXXXXXXXXXXX          XXX',
  'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
];

// from https://github.com/mikewesthad/navmesh#introduction
sx = 10;
sy = 6;
ex = 24;
ey = 18;
input = [
  '                              ',
  '                              ',
  '                              ',
  '       XXXXX      XXXXX       ',
  '       XXXXX      XXXXX       ',
  '                              ',
  '                              ',
  '   XX         XX         XX   ',
  '   XX         XX         XX   ',
  '   XX         XX         XX   ',
  '   XX         XX         XX   ',
  '   XX         XX         XX   ',
  '                              ',
  '                              ',
  '       XXXXX      XXXXX       ',
  '       XXXXX      XXXXX       ',
  '                              ',
  '                              ',
  '   XX         XX         XX   ',
  '   XX         XX         XX   ',
  '   XX         XX         XX   ',
  '   XX         XX         XX   ',
  '   XX         XX         XX   ',
  '                              ',
  '                              ',
  '       XXXXX      XXXXX       ',
  '       XXXXX      XXXXX       ',
  '                              ',
  '                              ',
  '                              ',
];

// sx = 10;
// sy = 6;
// ex = 74;
// ey = 6;
// input = [
//   '           X                X                             X                     ',
//   '           X                X                             X                     ',
//   '           X     XXXXXX     XXXXX     XXXXXXXXXXXXXXX     X        XXX          ',
//   '           X          X         X     XX            X     X       XXX           ',
//   '           X          X         X     XX     XX           X      XXX            ',
//   '           X          X         X     XX     XX           X     XXX       XXXXXX',
//   '           X          X         X     XX     XXXXXXXXXXXXXX    XXX       X      ',
//   '   XXXXXXXXX          X   XXXXXXX     XX                      XXX       XX      ',
//   '                      X               XX                     XXX        XX      ',
//   '                      X               XX                    XXX                 ',
// ];

let pfG: PathfinderGrid;
let pG: Rect[];
let pfRs: PathfinderRects;
let pRs: [number, number][];
let t0: number;

const process = (rects: Rect[]) => {
  t0 = Date.now();
  pfG = new PathfinderGrid(g, rects);
  console.log('pG...');
  pG = pfG.getPath(sx, sy, ex, ey);
  pfRs = new PathfinderRects(g, rects, pG);
  console.log('pRs...');
  pRs = pfRs.getPath(sx, sy, ex, ey);
  console.log(`done in ${Date.now() - t0} ms`);
  g.draw(rects, pG, pRs);
};

const g = new Grid();
g.init(input);

console.log('INPUT GRID (I)');
g.draw();

const rawRects = g.buildRawRects();
console.log('RAW RECTANGLES (R = f(I))');
process(rawRects);

const rectXs = g.buildRectXs();
console.log('RAW HORIZONTAL LINES (H = f(I))');
process(rectXs);

const rectYs = g.buildRectYs();
console.log('RAW VERTICAL LINES (V = g(I))');
process(rectYs);

const rects = g.chooseLines(rectXs, rectYs);
console.log('OPTIMIZED LINES (L = h(H, V))');
process(rects);

g.mergeRects(rects);
console.log('MERGED RECTANGLES (R = i(L))');
process(rects);

g.mergeRects(rects, true);
console.log('OPTIMIZED RECTANGLES (R = i(L))');
process(rects);

// console.log(`FINAL RESULT\nfrom ${count} empty cells to ${rects.length} rectangles (-${(100 * (1 - rects.length / count)).toFixed(1)}%)`);