import { Grid } from './grid';
import { Rect } from './rect';

export class Pathfinder {
  constructor(
    readonly grid: Grid,
    readonly rects: Rect[]
  ) {
  }
  getPath<T>(
    start: T,
    isDone: (current: T) => boolean,
    getNeighboors: (current: T) => T[],
    getScore: (current: T, neighbor: T) => number
  ): T[] {
    const open: T[] = [start];
    const from = new Map<T, T>();
    const scores = new Map<T, number>([[start, 0]]); 
    const close = new Set<T>();

    let current = open.shift() as T;
    let score = scores.get(current) as number;
    
    // find way to goal
    while (!isDone(current)) {
      for (const neighbor of getNeighboors(current)) {
        if (!close.has(neighbor)) {
          score = getScore(current, neighbor);
          // update open list
          if (!scores.has(neighbor)) {
            from.set(neighbor, current);
            scores.set(neighbor, score);
            open.push(neighbor);
          } else if (score < (scores.get(neighbor) as number)) {
            from.set(neighbor, current);
            scores.set(neighbor, score);
          }
          // update close list
          close.add(neighbor);
        }
      }

      open.sort((n1, n2) => (scores.get(n1) as number) - (scores.get(n2) as number));

      if (!open.length) {
        break;
      }

      current = open.shift() as T;
    }

    const result: T[] = [];

    // reconstruct path
    while (true) {
      result.unshift(current);
      if (from.has(current)) {
        current = from.get(current) as T;
      } else {
        break;
      }
    }

    return result;
  }
  fullPath<T>(
    sx: number, sy: number,
    path: T[],
    getXY: (current: T, fromX: number, fromY: number) => [number, number],
    gx: number, gy: number,
  ) {
    const fullPath: [number, number][] = [[sx, sy]];
    for (let i = 0; i < path.length - 1; i++) {
      let from = path[i];
      let to = path[i + 1];
      const [toX, toY] = getXY(to, sx, sy);
      const [fromX, fromY] = getXY(from, toX, toY);
      while (fromX !== toX || fromY !== toY) {
        fullPath.push([fromX, fromY]);
        if (fromX !== toX) {
          fromX += (toX - fromX) / Math.abs(toX - fromX);
        }
        if (fromY !== toY) {
          fromY += (toY - fromY) / Math.abs(toY - fromY);
        }
      }
      fullPath.push([fromX, fromY]);
    }
    return fullPath;
  }
}