import { Rect } from './rect';

type xy = [number, number];

export class Funnel {
  private _tuples = new Map<number, Map<number, xy>>();
  getTupleFor(x: number, y: number): xy {
    if (this._tuples.has(x)) {
      if ((this._tuples.get(x) as Map<number, xy>).has(y)) {
        return (this._tuples.get(x) as Map<number, xy>).get(y) as xy;
      }
      (this._tuples.get(x) as Map<number, xy>).set(y, [x, y]);
      return (this._tuples.get(x) as Map<number, xy>).get(y) as xy;
    }
    this._tuples.set(x, new Map([[y, [x, y]]]));
    return (this._tuples.get(x) as Map<number, xy>).get(y) as xy;
  }
  constructor(
    private readonly rects: Rect[],
    private readonly start: xy,
    private readonly end: xy,
  ) {}
  buildLeft(): xy[] {
    // 111111111|     
    // 111111111|2222222
    // 1 start 1|222 nte|pte 33333
    // 111111111|2222222|333333333
    //          |2222222|333333333
    //          |222 nbe|pbe end 3
    const prevTopEdges = new Map<number, xy>(); // pte
    const prevBottomEdges = new Map<number, xy>(); // pbe
    const nextTopEdges = new Map<number, xy>(); // nte
    const nextBottomEdges = new Map<number, xy>(); // nbe
    let edges: xy[];
    // append 
    for (let i = 0; i < this.rects.length - 1; i++) {
      edges = this.rects[i].commonEdgeWith(this.rects[i + 1]);
      if (edges.length === 2) {
        nextTopEdges.set(i, edges[0]);
        prevTopEdges.set(i + 1, edges[1]);
      } else {
        nextTopEdges.set(i, edges[0]);
        prevTopEdges.set(i + 1, edges[1]);
        nextBottomEdges.set(i, edges[2]);
        prevBottomEdges.set(i + 1, edges[3]);
      }
    }
    let edge: xy;
    edge = nextTopEdges.get(0)
    if (nextTopEdges.get(0)[0] !== this.start[0] ||)
  }
}