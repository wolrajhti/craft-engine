import { Grid } from './grid';
import { Rect } from './rect';
import { Pathfinder } from './pathfinder';

let input: string[];
let sx: number, sy: number, gx: number, gy: number;

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
gx = 33;
gy = 3;
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
gx = 24;
gy = 18;
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

sx = 10;
sy = 6;
gx = 74;
gy = 6;
input = [
  '           X                X                             X                     ',
  '           X                X                             X                     ',
  '           X     XXXXXX     XXXXX     XXXXXXXXXXXXXXX     X        XXX          ',
  '           X          X         X     XX            X     X       XXX           ',
  '           X          X         X     XX     XX           X      XXX            ',
  '           X          X         X     XX     XX           X     XXX       XXXXXX',
  '           X          X         X     XX     XXXXXXXXXXXXXX    XXX       X      ',
  '   XXXXXXXXX          X   XXXXXXX     XX                      XXX       XX      ',
  '                      X               XX                     XXX        XX      ',
  '                      X               XX                    XXX                 ',
];

let pf: Pathfinder, path: Rect[], fullPath: [number, number][];
let t0: number;

const g = new Grid();
g.init(input);

console.log('INPUT GRID (I)');
g.draw();

// const rawRects = g.buildRawRects();
console.log('RAW RECTANGLES (R = f(I))');
// pf = new Pathfinder(g, rawRects);
t0 = Date.now();
// path = pf.getPath(sx, sy, gx, gy);
// fullPath = pf.fullPath([[sx, sy], ...path, [gx, gy]]);
console.log(`done in ${Date.now() - t0} ms`);
// g.draw(rawRects, fullPath);

const rectXs = g.buildRectXs();
// console.log('RAW HORIZONTAL LINES (H = f(I))');
// pf = new Pathfinder(g, rectXs);
// t0 = Date.now();
// path = pf.getPath(sx, sy, gx, gy);
// fullPath = pf.fullPath([[sx, sy], ...path, [gx, gy]]);
// console.log(`done in ${Date.now() - t0} ms`);
// g.draw(rectXs, fullPath);

const rectYs = g.buildRectYs();
// console.log('RAW VERTICAL LINES (V = g(I))');
// pf = new Pathfinder(g, rectYs);
// t0 = Date.now();
// path = pf.getPath(sx, sy, gx, gy);
// fullPath = pf.fullPath([[sx, sy], ...path, [gx, gy]]);
// console.log(`done in ${Date.now() - t0} ms`);
// g.draw(rectYs, fullPath);

const rects = g.chooseLines(rectXs, rectYs);
// console.log('OPTIMIZED LINES (L = h(H, V))');
// pf = new Pathfinder(g, rects);
// t0 = Date.now();
// path = pf.getPath(sx, sy, gx, gy);
// fullPath = pf.fullPath([[sx, sy], ...path, [gx, gy]]);
// console.log(`done in ${Date.now() - t0} ms`);
// g.draw(rects, fullPath);

g.mergeRects(rects);
// console.log('MERGED RECTANGLES (R = i(L))');
// pf = new Pathfinder(g, rects);
// t0 = Date.now();
// path = pf.getPath(sx, sy, gx, gy);
// fullPath = pf.fullPath([[sx, sy], ...path, [gx, gy]]);
// console.log(`done in ${Date.now() - t0} ms`);
// g.draw(rects, fullPath);

g.mergeRects(rects, true);
console.log('OPTIMIZED RECTANGLES (R = i(L))');
pf = new Pathfinder(g, rects);
t0 = Date.now();
path = pf.getPath<Rect>(
  rects[g.i(sx, sy)],
  current => current.contains(gx, gy),
  current => g.neighboors(rects, current)
              .filter(neighborIndex => g.tokenAt(neighborIndex) === ' ')
              .map(neighborIndex => rects[neighborIndex]),
  (current, neighbor) => Math.sqrt(
    Math.pow(neighbor.cx() - current.cx(), 2) + Math.pow(neighbor.cy() - current.cy(), 2)
  )
);
console.log('COUCOU');
// fullPath = pf.fullPath([[sx, sy], ...path, [gx, gy]]);
console.log(`done in ${Date.now() - t0} ms`);
g.draw(rects, path);


// console.log(`FINAL RESULT\nfrom ${count} empty cells to ${rects.length} rectangles (-${(100 * (1 - rects.length / count)).toFixed(1)}%)`);