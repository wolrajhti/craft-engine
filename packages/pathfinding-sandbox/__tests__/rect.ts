import { Rect } from '../src/domain/rect';

describe('Rect', () => {
  describe('commonEdgeWith', () => {
    test('commonEdgeWith left', () => {
      // 111222
      // 111222
      // 111222
      const r1 = new Rect(0, 0, 3,3);
      const r2 = new Rect(3, 0, 3, 3);
      const bound = r1.commonEdgeWith(r2);
      expect(bound.length).toBe(4);
      expect(bound[0].x).toBe(2);
      expect(bound[0].y).toBe(0);
      expect(bound[1].x).toBe(3);
      expect(bound[1].y).toBe(0);
      expect(bound[2].x).toBe(2);
      expect(bound[2].y).toBe(2);
      expect(bound[3].x).toBe(3);
      expect(bound[3].y).toBe(2);
    });
  
    test('commonEdgeWith left 3->1', () => {
      // 1112
      // 111
      // 111
      const r1 = new Rect(0, 0, 3,3);
      const r2 = new Rect(3, 0, 1, 1);
      const bound = r1.commonEdgeWith(r2);
      expect(bound.length).toBe(2);
      expect(bound[0].x).toBe(2);
      expect(bound[0].y).toBe(0);
      expect(bound[1].x).toBe(3);
      expect(bound[1].y).toBe(0);
    });
  
    test('commonEdgeWith left 3_>1', () => {
      // 111
      // 111
      // 1112
      const r1 = new Rect(0, 0, 3,3);
      const r2 = new Rect(3, 2, 1, 1);
      const bound = r1.commonEdgeWith(r2);
      expect(bound.length).toBe(2);
      expect(bound[0].x).toBe(2);
      expect(bound[0].y).toBe(2);
      expect(bound[1].x).toBe(3);
      expect(bound[1].y).toBe(2);
    });
  
    test('commonEdgeWith bottom', () => {
      // 111
      // 111
      // 111
      // 222
      // 222
      // 222
      const r1 = new Rect(0, 0, 3,3);
      const r2 = new Rect(0, 3, 3, 3);
      const bound = r1.commonEdgeWith(r2);
      expect(bound.length).toBe(4);
      expect(bound[0].x).toBe(2);
      expect(bound[0].y).toBe(2);
      expect(bound[1].x).toBe(2);
      expect(bound[1].y).toBe(3);
      expect(bound[2].x).toBe(0);
      expect(bound[2].y).toBe(2);
      expect(bound[3].x).toBe(0);
      expect(bound[3].y).toBe(3);
    });
  
    test('commonEdgeWith bottom 3->1', () => {
      // 111
      // 111
      // 111
      //   2
      const r1 = new Rect(0, 0, 3,3);
      const r2 = new Rect(2, 3, 1, 1);
      const bound = r1.commonEdgeWith(r2);
      expect(bound.length).toBe(2);
      expect(bound[0].x).toBe(2);
      expect(bound[0].y).toBe(2);
      expect(bound[1].x).toBe(2);
      expect(bound[1].y).toBe(3);
    });
  
    test('commonEdgeWith bottom 3_>1', () => {
      // 111
      // 111
      // 111
      // 2  
      const r1 = new Rect(0, 0, 3,3);
      const r2 = new Rect(0, 3, 1, 1);
      const bound = r1.commonEdgeWith(r2);
      expect(bound.length).toBe(2);
      expect(bound[0].x).toBe(0);
      expect(bound[0].y).toBe(2);
      expect(bound[1].x).toBe(0);
      expect(bound[1].y).toBe(3);
    });
  
    test('commonEdgeWith right', () => {
      // 222111
      // 222111
      // 222111
      const r1 = new Rect(3, 0, 3,3);
      const r2 = new Rect(0, 0, 3, 3);
      const bound = r1.commonEdgeWith(r2);
      expect(bound.length).toBe(4);
      expect(bound[0].x).toBe(3);
      expect(bound[0].y).toBe(2);
      expect(bound[1].x).toBe(2);
      expect(bound[1].y).toBe(2);
      expect(bound[2].x).toBe(3);
      expect(bound[2].y).toBe(0);
      expect(bound[3].x).toBe(2);
      expect(bound[3].y).toBe(0);
    });
  
    test('commonEdgeWith right 3->1', () => {
      //  111
      //  111
      // 2111
      const r1 = new Rect(1, 0, 3,3);
      const r2 = new Rect(0, 2, 1, 1);
      const bound = r1.commonEdgeWith(r2);
      expect(bound.length).toBe(2);
      expect(bound[0].x).toBe(1);
      expect(bound[0].y).toBe(2);
      expect(bound[1].x).toBe(0);
      expect(bound[1].y).toBe(2);
    });
  
    test('commonEdgeWith right 3_>1', () => {
      // 2111
      //  111
      //  111
      const r1 = new Rect(1, 0, 3,3);
      const r2 = new Rect(0, 0, 1, 1);
      const bound = r1.commonEdgeWith(r2);
      expect(bound.length).toBe(2);
      expect(bound[0].x).toBe(1);
      expect(bound[0].y).toBe(0);
      expect(bound[1].x).toBe(0);
      expect(bound[1].y).toBe(0);
    });
  
    test('commonEdgeWith top', () => {
      // 222
      // 222
      // 222
      // 111
      // 111
      // 111
      const r1 = new Rect(0, 3, 3,3);
      const r2 = new Rect(0, 0, 3, 3);
      const bound = r1.commonEdgeWith(r2);
      expect(bound.length).toBe(4);
      expect(bound[0].x).toBe(0);
      expect(bound[0].y).toBe(3);
      expect(bound[1].x).toBe(0);
      expect(bound[1].y).toBe(2);
      expect(bound[2].x).toBe(2);
      expect(bound[2].y).toBe(3);
      expect(bound[3].x).toBe(2);
      expect(bound[3].y).toBe(2);
    });
  
    test('commonEdgeWith top 3->1', () => {
      // 2
      // 111
      // 111
      // 111
      const r1 = new Rect(0, 1, 3,3);
      const r2 = new Rect(0, 0, 1, 1);
      const bound = r1.commonEdgeWith(r2);
      expect(bound.length).toBe(2);
      expect(bound[0].x).toBe(0);
      expect(bound[0].y).toBe(1);
      expect(bound[1].x).toBe(0);
      expect(bound[1].y).toBe(0);
    });
  
    test('commonEdgeWith top 3_>1', () => {
      //   2
      // 111
      // 111
      // 111
      const r1 = new Rect(0, 1, 3,3);
      const r2 = new Rect(2, 0, 1, 1);
      const bound = r1.commonEdgeWith(r2);
      expect(bound.length).toBe(2);
      expect(bound[0].x).toBe(2);
      expect(bound[0].y).toBe(1);
      expect(bound[1].x).toBe(2);
      expect(bound[1].y).toBe(0);
    });
  });
});
