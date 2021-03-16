import { Vector2 } from '../src/vector2';

describe('Vector2', () => {
  describe('intersection', () => {
    test('cas 1: basic diagonal', () => {
      const a = new Vector2(0, 0);
      const b = new Vector2(1, 1);
      const c = new Vector2(1, 0);
      const d = new Vector2(0, 1);
      const inter = a.intersection(b, c, d);
      expect((inter as Vector2).equals(new Vector2(0.5, 0.5))).toBeTruthy();
    });
    test('cas 2: basic ortho', () => {
      const a = new Vector2(125, 17);
      const b = new Vector2(125, 38);
      const c = new Vector2(-42, 25);
      const d = new Vector2(148, 25);
      const inter = a.intersection(b, c, d);
      expect((inter as Vector2).equals(new Vector2(125, 25))).toBeTruthy();
    });
  });
  describe('normalize', () => {
    const a = new Vector2(20, 20);
    test('cas 1: normalize by its norm', () => {
      expect(a.normalize(a.len()).equals(a)).toBeTruthy();
    });
    test('cas 1: basic diagonal', () => {
      expect(a.normalize().equals(new Vector2(1, 1).normalize())).toBeTruthy();
    });
  });
  describe('dot', () => {
    test('cas 1: basic ortho', () => {
      expect(new Vector2(1, 0).dot(new Vector2(0, 1))).toBe(0);
    });
    test('cas 2: basic ortho negative', () => {
      expect(new Vector2(0, 1).dot(new Vector2(1, 0))).toBe(0);
    });
    test('cas 3: flat', () => {
      expect(new Vector2(1, 0).dot(new Vector2(-1, 0))).toBe(-1);
    });
    test('cas 4: flat', () => {
      expect(new Vector2(1, 0).dot(new Vector2(1, 0))).toBe(1);
    });
  });
  describe('cross', () => {
    test('cas 1: basic ortho', () => {
      expect(new Vector2(1, 0).cross(new Vector2(0, 1))).toBe(1);
    });
    test('cas 2: basic ortho negative', () => {
      expect(new Vector2(0, 1).cross(new Vector2(1, 0))).toBe(-1);
    });
    test('cas 3: flat', () => {
      expect(new Vector2(1, 0).cross(new Vector2(-1, 0))).toBe(0);
    });
    test('cas 4: flat', () => {
      expect(new Vector2(1, 0).cross(new Vector2(3, 0))).toBe(0);
    });
  });
});