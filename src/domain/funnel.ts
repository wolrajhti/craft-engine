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
  tighterLeftSideIndex(w: Vector2, coords = this.left): number {
    let u: Vector2;
    let v: Vector2;
    for (let i = 0; i < coords.length; i++) {
      u = i === 0 ? this.tail[this.tail.length - 1] : coords[i - 1];
      v = coords[i];
      // test if w is on the right of v from u (uv.cross(uw) > 0)
      if (v.sub(u).cross(w.sub(u)) >= 0) {
        // uw is tighter than uv so v and all next items should be discarded
        return i;
      }
    };
    return -1;
  }
  tighterRightSideIndex(w: Vector2, coords = this.right): number {
    let u: Vector2;
    let v: Vector2;
    for (let i = 0; i < coords.length; i++) {
      u = i === 0 ? this.tail[this.tail.length - 1] : coords[i - 1];
      v = coords[i];
      // test if v is on the right of w from u (uw.cross(uv) > 0)
      if (w.sub(u).cross(v.sub(u)) >= 0) {
        // uw is tighter than uv so v and all next items should be discarded
        return i;
      }
    };
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
  appendEdge(nl: Vector2, nr: Vector2): void {
    const nlTighterLeftSideIndex = this.tighterLeftSideIndex(nl);
    const nlTighterLeftSideOfRightIndex = this.tighterLeftSideIndex(nl, this.right);
    const nrTighterRightSideIndex = this.tighterRightSideIndex(nr);
    const nrTighterRightSideOfLeftIndex = this.tighterRightSideIndex(nr, this.left);
    // console.log(
    //   `nl: ${nl.x}, ${nl.y}, nr: ${nr.x}, ${nr.y}`,
    //   `\n\tnlIsOnTheRightSideOfLeft: ${nlTighterLeftSideIndex}`,
    //   `\n\tnrIsOnTheLeftSideOfRight: ${nlTighterLeftSideOfRightIndex}`,
    //   `\n\tnlIsOnTheRightSideOfRight: ${nrTighterRightSideIndex}`,
    //   `\n\tnrIsOnTheLeftSideOfLeft: ${nrTighterRightSideOfLeftIndex}`
    // );
    if (nlTighterLeftSideIndex !== -1) {
      if (nlTighterLeftSideOfRightIndex !== -1) {
        // update the tail
        this.tail.push(...this.right.splice(0, nlTighterLeftSideOfRightIndex + 1));
        this.left.splice(0, this.left.length, nl);
      }
      this.left.splice(nlTighterLeftSideIndex, this.left.length - nlTighterLeftSideIndex, nl);
    } else {
      this.left.push(nl);
    }
    if (nrTighterRightSideIndex !== -1) {
      if (nrTighterRightSideOfLeftIndex !== - 1) {
        // update the tail
        this.tail.push(...this.left.splice(0, nrTighterRightSideOfLeftIndex + 1));
        this.right.splice(0, this.right.length, nr);
      }
      this.right.splice(nrTighterRightSideIndex, this.right.length - nrTighterRightSideIndex, nr);
    } else {
      this.right.push(nr);
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
  }
}