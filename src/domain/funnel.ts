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
  getFirstIndexOnTheLeftOfLeftSide(nl: Vector2): number {
    return this.tighterIndex(nl, this.left);
  }
  getLastIndexOnTheLeftOfRightSide(nl: Vector2): number {
    return this.tighterIndex(nl, this.right, false, true);
  }
  getFirstIndexOnTheRightOfRightSide(nr: Vector2): number {
    return this.tighterIndex(nr, this.right, true);
  }
  getLastIndexOnTheRightOfLeftSide(nr: Vector2): number {
    return this.tighterIndex(nr, this.right, true, true);
  }
  appendEdge(nl: Vector2, nr: Vector2): void {
    // console.log(`nl: ${nl.x}, ${nl.y}, nr: ${nr.x}, ${nr.y}`);
    if (this.right.length && nl.equals(this.right[this.right.length - 1])) {
      this.tail.push(...this.right.splice(0, this.right.length));
      this.left.splice(0, this.left.length);
    } else {
      const nlTighterLeftSideIndex = this.tighterIndex(nl, this.left);
      if (nlTighterLeftSideIndex !== -1) {
        const nlTighterLeftSideOfRightIndex = this.tighterIndex(nl, this.right, false, true);
        if (nlTighterLeftSideOfRightIndex !== -1) {
          // update the tail
          this.tail.push(...this.right.splice(0, nlTighterLeftSideOfRightIndex + 1));
          this.left.splice(0, this.left.length, nl);
        } else {
          this.left.splice(nlTighterLeftSideIndex, this.left.length - nlTighterLeftSideIndex, nl);
        }
      } else {
        this.left.push(nl);
      }
    }
    if (this.left.length && nr.equals(this.left[this.left.length - 1])) {
      this.tail.push(...this.left.splice(0, this.left.length));
      this.right.splice(0, this.right.length);
    } else {
      const nrTighterRightSideIndex = this.tighterIndex(nr, this.right, true);
      if (nrTighterRightSideIndex !== -1) {
        const nrTighterRightSideOfLeftIndex = this.tighterIndex(nr, this.left, true, true);
        if (nrTighterRightSideOfLeftIndex !== - 1) {
          // update the tail
          this.tail.push(...this.left.splice(0, nrTighterRightSideOfLeftIndex + 1));
          this.right.splice(0, this.right.length, nr);
        } else {
          this.right.splice(nrTighterRightSideIndex, this.right.length - nrTighterRightSideIndex, nr);
        }
      } else {
        this.right.push(nr);
      }
    }
  }
  build(): void {
    let edges: Vector2[];
    for (let i = 0; i < this.rects.length - 1; i++) {
      edges = this.rects[i].commonEdgeWith(this.rects[i + 1]);
      if (edges.length === 2) {
        this.appendEdge(edges[0], edges[0]);
        this.appendEdge(edges[1], edges[1]);
      } else {
        this.appendEdge(edges[0], edges[2]);
        this.appendEdge(edges[1], edges[3]);
      }
    }
    this.appendEdge(this.end, this.end);
  }
}