import { Grid } from './grid';
import { Rect } from './rect';
import { PathfinderGrid } from './pathfinderGrid';
import { Funnel } from './funnel';
import { Vector2 } from './vector2';

const useCase = (
  input: string[],
  sx: number, sy: number,
  ex: number, ey: number
) => {
  let pfG: PathfinderGrid;
  let pG: Rect[];
  let t0: number;
  let f: Funnel;
  
  const process = (rects: Rect[]) => {
    t0 = Date.now();
    pfG = new PathfinderGrid(g, rects);
    pG = pfG.getPath(sx, sy, ex, ey);
    f = new Funnel(pG, new Vector2(sx, sy), new Vector2(ex, ey));
    f.build();
    console.log(`done in ${Date.now() - t0} ms`);
    g.draw(rects, pG, f.tail); // comment pG to see all cells
  };
  
  const g = new Grid();
  g.init(input);
  
  // console.log('INPUT GRID (I)');
  // g.draw();
  
  const rawRects = g.buildRawRects();
  // console.log('RAW RECTANGLES (R = f(I))');
  // process(rawRects);
  
  const rectXs = g.buildRectXs();
  // console.log('RAW HORIZONTAL LINES (H = f(I))');
  // process(rectXs);
  
  const rectYs = g.buildRectYs();
  // console.log('RAW VERTICAL LINES (V = g(I))');
  // process(rectYs);
  
  const rects = g.chooseLines(rectXs, rectYs);
  // console.log('OPTIMIZED LINES (L = h(H, V))');
  // process(rects);
  
  g.mergeAllRects(rects);
  // console.log('MERGED RECTANGLES (R = i(L))');
  // process(rects);
  
  g.mergeAllRects(rects, true);
  // console.log('OPTIMIZED RECTANGLES (R = i(L))');
  process(rects);
}

useCase([
  'XXX ',
  'X   ',
  '    ',
  ' XXX',
], 3, 0, 0, 3);

useCase([
  'XXXXXX    X     X',
  'X        XXX     ',
  '  X   X          ',
  '  XX XX    XXXX  ',
  '  XX        XXX  ',
  '     XX          ',
  '  XXXXX          ',
  '              XXX',
], 1, 1, 10, 6);

useCase([
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
], 1, 2, 6, 11);

useCase([
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
], 1, 1, 1, 11);

useCase([
  'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
  'X XXXXXXXXXXXXXX                  X',
  'X XXXXXXX  XXXXX    XXXXXXXX    XXX',
  'X  XXXX             XXXXXXXX  XXXXX',
  'X   X      XXXXX    XXXXXXXXXXXXXXX',
  'X    XXXXX XXXXX    XXXXXXXXXXXXXXX',
  'XX    XXXX XXX         XXXXX  XXXXX',
  'XX     XXX XXXXXXXXXX  XXXXX XXXXXX',
  'XXX    XXX     XXXXXX  XXXX    XXXX',
  'XXXX   XXX     XXXXXX  XXXXX XX XXX',
  'XXXXX          XXXXXX   XXXX    XXX',
  'XXXXXX    XXXXXXXXXXXXX         XXX',
  'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
], 1, 1, 33, 1);

useCase([
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
], 2, 11, 33, 3);

// from https://github.com/mikewesthad/navmesh#introduction
useCase([
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
], 10, 6, 24, 18);

useCase([
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
], 10, 6, 74, 6);