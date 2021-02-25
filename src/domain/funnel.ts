import { Rect } from './rect';
import { Vector2 } from './vector2';

class Link extends Vector2 {
  constructor(
    x: number, y: number,
    public left?: Link,
    public right?: Link
  ) {
    super(x, y);
  }
}

export class Funnel {
  constructor(
    private readonly rects: Rect[],
    private readonly start: Vector2,
    private readonly end: Vector2,
  ) {}
  getEntryPoints(
    k: Vector2, l: Vector2, m: Vector2,
    q: Vector2, r: Vector2, s: Vector2
  ) {
    // +-----K           K-----+
    // |     |           |     |
    // |     L +-----+   |     L +-----+
    // |     | |     |   |     | |     |
    // |     R +-----+   |     | S-----+
    // |     |           |     |
    // +-----+           +-----+
    // +-----+
    // |     |
    // |     | M-----+
    // |  K  | |     |
    // |     | S-----+
    // |     |
    // +-----+
    // +-----+           +-----+
    // |     |           |     |
    // |     L +-----+   |     | M-----+
    // |     | |     |   |     | |     |
    // |     R +-----+   |     R +-----+
    // |     |           |     |
    // +-----K           K-----+
    // calcul de KM, KL, KS, KR
    // calcul de QM, QL, QS, QR
    // M est valide quand :
    //   - M est à droite de L (KL.cross(KM) > 0)
    //   - R est à droite de M (KM.cross(KR) > 0),
    // sinon L
    // S est valide quand :
    //   - S est à droite de L (QL.cross(QS) > 0)
    //   - R est à droite de S (QS.cross(QR) > 0),
    // sinon R
    const km = m.sub(k);
    const kl = l.sub(k);
    const kr = r.sub(k);
    const ql = l.sub(q);
    const qs = s.sub(q);
    const qr = r.sub(q);
    if (kl.cross(km) >= 0 && km.cross(kr) >= 0) {
      if (qs.cross(qr) >= 0 && ql.cross(qs) >= 0) {
        return [m, s];
      } else {
        return [m, r];
      }
    } else if (qs.cross(qr) >= 0 && ql.cross(qs) >= 0) {
      return [l, s];
    } else {
      return [l, r];
    }
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
  build(): Link {
    const candidates = this.buildCandidates();
    let i = 0;
    let j = 0;
    let apex = new Link(this.start.x, this.start.y);
    const endLink = new Link(this.end.x, this.end.y);
    let leftLink = apex;
    let rightLink = apex;
    let left: Vector2;
    let right: Vector2;
    while (i < candidates.left.length || j < candidates.right.length) {
      console.log(i, j);
      [left, right] = this.getEntryPoints(
        leftLink, candidates.left[i], i === candidates.left.length - 1 ? this.end : candidates.left[i + 1],
        rightLink, candidates.right[j], j === candidates.right.length - 1 ? this.end : candidates.right[j + 1]
      );
      if (left.equals(candidates.left[i + 1])) {
        i = Math.min(candidates.left.length - 1, i + 1);
      }
      if (right.equals(candidates.right[j + 1])) {
        j = Math.min(candidates.right.length - 1, j + 1)
      }
      leftLink.left = new Link(left.x, left.y);
      rightLink.right = new Link(right.x, left.y);
      leftLink = leftLink.left;
      rightLink = rightLink.right;
      i = Math.min(candidates.left.length - 1, i + 1);
      j = Math.min(candidates.right.length - 1, j + 1);
    }
    leftLink.left = new Link(this.end.x, this.end.y);
    rightLink.right = leftLink.left;
    return apex;
  }
}