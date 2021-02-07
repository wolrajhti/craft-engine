import { AbstractPathfinder } from './abstractPathfinder';
import { Grid } from './grid';
import { Rect } from './rect';

export class PathfinderGrid extends AbstractPathfinder<Rect> {
  private _end?: Rect;
  constructor(
    private grid: Grid,
    private rects: Rect[]
  ) {
    super();
  }
  isDone(current: Rect): boolean {
    return current === this._end;
  }
  getNeighboors(current: Rect): Rect[] {
    return this.grid.neighboors(this.rects, current)
      .filter(neighborIndex => this.grid.tokenAt(neighborIndex) === ' ')
      .map(neighborIndex => this.rects[neighborIndex]);
  }
  getScore(current: Rect, neighbor: Rect, currentScore: number): number {
    return currentScore + Math.sqrt(
      Math.pow(neighbor.cx() - current.cx(), 2) + Math.pow(neighbor.cy() - current.cy(), 2)
    )
  }
  getPath(sx: number, sy: number, ex: number, ey: number): Rect[] {
    this._end = this.rects[this.grid.i(ex, ey)];
    return super._getPath([this.rects[this.grid.i(sx, sy)]]);
  }
}
