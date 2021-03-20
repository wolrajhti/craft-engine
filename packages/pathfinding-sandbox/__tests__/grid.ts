import { Grid } from '../src/domain/grid';
import { Rect } from '../src/domain/rect';

describe('Grid', () => {
  describe('applyCases', () => {
    test('', () => {
      // 12
      // 12
      // 12
      // 12
      // 12
      const g = new Grid();
      const r1 = new Rect(0, 2, 1, 5);
      const r2 = new Rect(1, 2, 1, 5);
      expect(g.mergeRects(r1, r2).map(r => r.toString()).join(', '))
        .toBe(g.mergeRects(r2, r1).map(r => r.toString()).join(', '));
    });
    test('', () => {
      // 21
      // 21
      // 21
      // 21
      // 21
      const g = new Grid();
      const r1 = new Rect(2, 2, 1, 5);
      const r2 = new Rect(1, 2, 1, 5);
      expect(g.mergeRects(r1, r2).map(r => r.toString()).join(', '))
        .toBe(g.mergeRects(r2, r1).map(r => r.toString()).join(', '));
    });
    test('', () => {
      // 21111
      // 21111
      // 21111
      // 21111
      // 21111
      // 2
      // 2
      const g = new Grid();
      const r1 = new Rect(2, 2, 4, 5);
      const r2 = new Rect(1, 2, 1, 7);
      expect(g.mergeRects(r1, r2).map(r => r.toString()).join(', '))
        .toBe(g.mergeRects(r2, r1).map(r => r.toString()).join(', '));
    });
    test('', () => {
      //   1111
      //   1111
      //   1111
      //   1111
      // 222222
      const g = new Grid();
      const r1 = new Rect(-4, 2, 4, 4);
      const r2 = new Rect(-6, 6, 6, 1);
      expect(g.mergeRects(r1, r2).map(r => r.toString()).join(', '))
        .toBe(g.mergeRects(r2, r1).map(r => r.toString()).join(', '));
    });
    test('', () => {
      //   1111
      //   1111
      //   1111
      //   1111
      // 222222
      // 222222
      // 222222
      const g = new Grid();
      const r1 = new Rect(-4, 2, 4, 4);
      const r2 = new Rect(-6, 6, 6, 3);
      expect(g.mergeRects(r1, r2).map(r => r.toString()).join(', '))
        .toBe(g.mergeRects(r2, r1).map(r => r.toString()).join(', '));
    });
  });
});
