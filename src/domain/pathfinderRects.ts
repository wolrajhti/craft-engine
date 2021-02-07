import { AbstractPathfinder } from './abstractPathfinder';
import { Grid } from './grid';
import { Rect } from './rect';

type xy = [number, number];

export class PathfinderRects extends AbstractPathfinder<xy> {
  private _tuples = new Map<number, Map<number, xy>>();
  private _end?: xy;
  constructor(
    private grid: Grid,
    private rects: Rect[],
    private roughPath: Rect[]
  ) {
    super();
  }
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
  isDone(current: xy): boolean {
    return current === this._end;
  }
  getNeighboors(current: xy): xy[] {
    const currentRect = this.rects[this.grid.i(...current)];
    const currentRectIndex = this.roughPath.indexOf(currentRect);
    if (currentRectIndex === this.roughPath.length - 1) {
      return [this._end as xy];
    } else {
      return currentRect.borderWith(this.roughPath[currentRectIndex + 1])
        .map(([x, y]) => this.getTupleFor(x, y));
    }
  }
  getScore(current: xy, neighbor: xy, currentScore: number): number {
    return currentScore + Math.sqrt(
      Math.pow(neighbor[0] - current[0], 2) + Math.pow(neighbor[1] - current[1], 2)
    )
  }
  getPath(sx: number, sy: number, ex: number, ey: number): xy[] {
    this._end = this.getTupleFor(ex, ey);
    return super._getPath([this.getTupleFor(sx, sy)]);
  }
}
