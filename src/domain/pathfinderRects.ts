import { AbstractPathfinder } from './abstractPathfinder';
import { Grid } from './grid';
import { Rect } from './rect';

type xy = [number, number];

export class PathfinderRects extends AbstractPathfinder<xy> {
  constructor(
    private grid: Grid,
    private rects: Rect[],
    private roughPath: Rect[]
  ) {
    super();
  }
  isDone(start: xy, current: xy, end: xy): boolean {
    return current[0] === end[0] && current[1] === end[1];
  }
  getNeighboors(start: xy, current: xy, end: xy): xy[] {
    const currentRect = this.rects[this.grid.i(...current)];
    const currentRectIndex = this.roughPath.indexOf(currentRect);
    if (currentRectIndex === this.roughPath.length - 1) {
      return [end];
    } else {
      return currentRect.borderWith(this.roughPath[currentRectIndex + 1]);
    }
  }
  getScore(start: xy, current: xy, neighbor: xy, end: xy, currentScore: number): number {
    return currentScore + Math.sqrt(
      Math.pow(neighbor[0] - current[0], 2) + Math.pow(neighbor[1] - current[1], 2)
    )
  }
  getPath(sx: number, sy: number, ex: number, ey: number): xy[] {
    return super._getPath(
      [sx, sy],
      [ex, ey]
    );
  }
}
