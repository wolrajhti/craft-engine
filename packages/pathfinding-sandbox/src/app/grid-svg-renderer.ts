import { Grid } from './../domain/grid';
import { CellSvgRenderer } from './cell-svg-renderer';

export class GridSvgRenderer {
  cellContainer: SVGGElement;
  constructor(
    readonly grid: Grid,
    readonly svg: SVGSVGElement,
    readonly cellSize: number,
    readonly cellRenderers: Map<string, CellSvgRenderer>
  ) {
    this.cellContainer = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    this.svg.appendChild(this.cellContainer);
  }
  clear(): void {
    while (this.cellContainer.firstChild) {
      this.cellContainer.removeChild(this.cellContainer.firstChild);
    }
  }
  render(): void {
    this.clear();
    const viewRect = this.svg.viewBox.baseVal;
    
    const gxMin = Math.floor(viewRect.x / this.cellSize);
    const gxMax = Math.floor((viewRect.x + viewRect.width) / this.cellSize);
    const gyMin = Math.floor(viewRect.y / this.cellSize);
    const gyMax = Math.floor((viewRect.y + viewRect.height) / this.cellSize);

    console.log(`gxMin ${gxMin}; gyMin ${gyMin}; gxMax ${gxMax}; gyMax ${gyMax}`);

    let gx = gxMin;
    let gy = gyMin;
    let token: string;
    let cellToRender: SVGElement;
    while (gx !== gxMax || gy !== gyMax) {
      token = this.grid.tokenAt(this.grid.i(gx, gy));
      if (this.cellRenderers.has(token)) {
        cellToRender = (this.cellRenderers.get(token) as CellSvgRenderer).new(gx * this.cellSize, gy * this.cellSize);
        this.cellContainer.appendChild(cellToRender);
      }
      if (gx === gxMax) {
        gx = 0;
        gy++;
      } else {
        gx++;
      }
    }
  }
}