import { GridSvgRenderer } from "./grid-svg-renderer";

export class CellSvgRenderer {
  private template: SVGRectElement;
  constructor(
    readonly gridSvgRenderer: GridSvgRenderer,
    readonly fill: string,
    readonly stroke: string,
  ) {
    this.template = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    this.template.setAttribute('width', gridSvgRenderer.cellSize.toFixed());
    this.template.setAttribute('height', gridSvgRenderer.cellSize.toFixed());
  }
  new(x: number, y: number): SVGRectElement {
    const instance = this.template.cloneNode() as SVGRectElement;
    instance.setAttribute('x', x.toFixed());
    instance.setAttribute('y', y.toFixed());
    return instance;
  }
}