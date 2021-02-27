import { Rect } from './rect';
import { Vector2 } from './vector2';

export class Funnel {
  tail: Vector2[] = [this.start];
  left: Vector2[] = [];
  right: Vector2[] = [];
  constructor(
    private readonly rects: Rect[],
    private readonly start: Vector2,
    private readonly end: Vector2,
  ) {}
  testSide(u: Vector2, v: Vector2, w: Vector2): boolean {
    return v.sub(u).cross(w.sub(u)) >= 0;
  }
  tighterIndex(w: Vector2, coords: Vector2[], left = false, findLastIndex = false): number {
    let u: Vector2;
    let v: Vector2;
    if (findLastIndex) {
      if (left) {
        for (let i = coords.length - 1; -1 < i; i--) {
          u = i === 0 ? this.tail[this.tail.length - 1] : coords[i - 1];
          v = coords[i];
          if (this.testSide(u, w, v)) {
            return i;
          }
        }
      } else {
        for (let i = coords.length - 1; -1 < i; i--) {
          u = i === 0 ? this.tail[this.tail.length - 1] : coords[i - 1];
          v = coords[i];
          if (this.testSide(u, v, w)) {
            return i;
          }
        }
      }
    } else if (left) {
      for (let i = 0; i < coords.length; i++) {
        u = i === 0 ? this.tail[this.tail.length - 1] : coords[i - 1];
        v = coords[i];
        if (this.testSide(u, w, v)) {
          return i;
        }
      };
    } else {
      for (let i = 0; i < coords.length; i++) {
        u = i === 0 ? this.tail[this.tail.length - 1] : coords[i - 1];
        v = coords[i];
        if (this.testSide(u, v, w)) {
          return i;
        }
      };
    }
    return -1;
  }
  buildCandidates(): {
    left: Vector2[],
    right: Vector2[],
  } {
    let edges: Vector2[];
    const left: Vector2[] = [];
    const right: Vector2[] = [];
    for (let i = 0; i < this.rects.length - 1; i++) {
      edges = this.rects[i].commonEdgeWith(this.rects[i + 1]);
      if (edges.length === 2) {
        left.push(edges[0], edges[1]);
        right.push(edges[0], edges[1]);
      } else {
        left.push(edges[0], edges[1]);
        right.push(edges[2], edges[3]);
      }
    }
    return {left, right};
  }
  appendNext(
    n: Vector2,
    left = false,
    side = left ? this.right : this.left,
    otherSide = left ? this.left : this.right,
  ): void {
    const otherSideTighterIndex = this.tighterIndex(n, otherSide, left, true);
    if (otherSideTighterIndex !== -1) {
      // we add to the tail the part of otherSide before otherSideTighterIndex
      this.tail.push(...otherSide.splice(0, otherSideTighterIndex + 1));
      // we empty side
      side.splice(0, side.length);
    } else {
      const sideTighterIndex = this.tighterIndex(n, side, left);
      if (sideTighterIndex !== -1) {
        // we discard the part of side after sideTighterIndex
        side.splice(sideTighterIndex, side.length - sideTighterIndex);
      }
    }
    if (!this.tail[this.tail.length - 1].equals(n)) {
      // we add n to side only if it is not already on the tail
      side.push(n);
    }
  }
  build(): void {
    let edges: Vector2[];
    for (let i = 0; i < this.rects.length - 1; i++) {
      edges = this.rects[i].commonEdgeWith(this.rects[i + 1]);
      if (edges.length === 2) {
        this.appendNext(edges[0]);
        this.appendNext(edges[0], true);
        this.appendNext(edges[1]);
        this.appendNext(edges[1], true);
      } else {
        this.appendNext(edges[0]);
        this.appendNext(edges[2], true);
        this.appendNext(edges[1]);
        this.appendNext(edges[3], true);
      }
    }
    this.appendNext(this.end);
    this.appendNext(this.end, true);
  }
}