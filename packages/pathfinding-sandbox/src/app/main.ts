import { GridSvgRenderer } from './grid-svg-renderer';
import { CellSvgRenderer } from './cell-svg-renderer';
import { Grid } from '../domain/grid';

const grid = new Grid();
grid.init([
  'XXXXXX    X     X',
  'X        XXX     ',
  '  X   X          ',
  '  XX XX    XXXX  ',
  '  XX        XXX  ',
  '     XX          ',
  '  XXXXX          ',
  '              XXX',
]);
const cellRenderers = new Map<string, CellSvgRenderer>();
const gridSvgRenderer = new GridSvgRenderer(
  grid,
  document.querySelector('#content0') as SVGSVGElement,
  64,
  cellRenderers
);
const obstacleRenderer = new CellSvgRenderer(
  gridSvgRenderer,
  'black',
  'red'
);
const emptyRenderer = new CellSvgRenderer(
  gridSvgRenderer,
  'white',
  'green'
);
cellRenderers.set('X', obstacleRenderer);
cellRenderers.set(' ', emptyRenderer);
gridSvgRenderer.render();