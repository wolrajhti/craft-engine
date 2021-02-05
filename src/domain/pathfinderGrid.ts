import { AbstractPathfinder } from './abstractPathfinder';
import { Grid } from './grid';
import { Rect } from './rect';

export class PathfinderGrid extends AbstractPathfinder<Rect> {
  constructor(
    private grid: Grid,
    private rects: Rect[]
  ) {
    super();
  }
  isDone(start: Rect, current: Rect, end: Rect): boolean {
    return current === end;
  }
  getNeighboors(start: Rect, current: Rect, end: Rect): Rect[] {
    return this.grid.neighboors(this.rects, current)
      .filter(neighborIndex => this.grid.tokenAt(neighborIndex) === ' ')
      .map(neighborIndex => this.rects[neighborIndex]);
  }
  getScore(start: Rect, current: Rect, neighbor: Rect, end: Rect, currentScore: number): number {
    return currentScore + Math.sqrt(
      Math.pow(neighbor.cx() - current.cx(), 2) + Math.pow(neighbor.cy() - current.cy(), 2)
    )
  }
  getPath(sx: number, sy: number, ex: number, ey: number): Rect[] {
    return super._getPath(
      this.rects[this.grid.i(sx, sy)],
      this.rects[this.grid.i(ex, ey)],
    );
  }
}
