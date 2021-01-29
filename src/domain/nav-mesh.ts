import { Grid } from './grid';

let input: string[];

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


// // from https://github.com/mikewesthad/navmesh#introduction
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

const g = new Grid();
g.init(input);

console.log('INPUT GRID (I)');
g.draw();

const rectXs = g.buildRectXs();
console.log('RAW HORIZONTAL LINES (H = f(I))');
g.draw(rectXs);

const rectYs = g.buildRectYs();
console.log('RAW VERTICAL LINES (V = g(I))');
g.draw(rectYs);

const rects = g.chooseLines(rectXs, rectYs);
console.log('OPTIMIZED LINES (L = h(H, V))');
g.draw(rects);

g.mergeRects(rects);
console.log('MERGED RECTANGLES (R = i(L))');
g.draw(rects);

g.mergeRects(rects, true);
console.log('OPTIMIZED RECTANGLES (R = i(L))');
g.draw(rects);

// console.log(`FINAL RESULT\nfrom ${count} empty cells to ${rects.length} rectangles (-${(100 * (1 - rects.length / count)).toFixed(1)}%)`);