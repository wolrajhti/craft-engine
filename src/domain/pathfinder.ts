import { Grid } from './grid';
import { Rect } from './rect';

type From = [number, number, number];

export class Pathfinder {
  constructor(
    readonly grid: Grid,
    readonly rects: Rect[]
  ) {
  }
  len(x1: number, y1: number, x2: number, y2: number): number {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  }
  getPath(sx: number, sy: number, gx: number, gy: number, token = ' '): [number, number][] {
    const rG = this.rects[this.grid.i(gx, gy)];

    let from: From = [sx, sy, 0];
    const open: From[] = [from];
    const xyMap = new Map<number, Map<number, From>>([[sx, new Map([[sy, from]])]]); // retrieve from by x by y
    const close = new Map<number, Set<number>>(); // list all closed x by y
    
    let yMap: Map<number, From>;
    let [ox, oy, score] = open.shift() as From;
    let r = this.rects[this.grid.i(ox, oy)];
    let tx: number, ty: number, ts: number;


    function helper(dx: number, dy: number, ds: number) {
      from = [ox, oy, score];
      tx = ox + dx, ty = oy + dy;
      ts = score + ds;

      // update close list
      if (close.has(tx) && (close.get(tx) as Set<number>).has(ty)) {
        return;
      }
      close.set(tx, close.get(tx) || new Set());
      (close.get(tx) as Set<number>).add(ty);

      // update open list
      if (xyMap.has(tx)) {
        yMap = xyMap.get(tx) as Map<number, From>;
        if (yMap.has(ty)) {
          if (ts < (yMap.get(ty) as From)[2]) {
            yMap.set(ty, from);
          }
        } else {
          open.push([tx, ty, ts]);
          yMap.set(ty, from);
        }
      } else {
        open.push([tx, ty, ts]);
        xyMap.set(ox + dx, new Map([[ty, from]]));
      }
    }
    
    // find way to goal
    while (r !== rG) {
      for (const n of this.grid.neighboors(this.rects, r)) {
        if (this.grid.tokenAt(n) === token) {
          const [nx, ny] = this.rects[n].project(ox, oy);
          helper(nx - ox, ny - oy, this.len(ox, oy, nx, ny));
        }
      }

      open.sort((f1, f2) => f1[2] - f2[2]);

      if (!open.length) {
        break;
      }

      [ox, oy, score] = open.shift() as From;
      r = this.rects[this.grid.i(ox, oy)];
    }

    const result: [number, number][] = [];

    // reconstruct path
    while (ox !== sx || oy !== sy) {
      // console.log(ox, oy, xyMap.get(ox).get(oy));
      result.unshift([ox, oy]);
      [ox, oy] = (xyMap.get(ox) as Map<number, From>).get(oy) as From;
    }

    return result;
  }
  fullPath(waypoints: [number, number][]) {
    const fullPath: [number, number][] = [];
    for (let i = 0; i < waypoints.length - 1; i++) {
      let [fromX, fromY] = waypoints[i];
      const from = this.rects[this.grid.i(fromX, fromY)];
      const [toX, toY] = from.project(...waypoints[i + 1]);
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
    fullPath.push(waypoints[waypoints.length - 1]);
    return fullPath;
  }
}