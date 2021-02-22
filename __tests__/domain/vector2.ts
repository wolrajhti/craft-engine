import { Vector2 } from '../../src/domain/vector2';

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
});