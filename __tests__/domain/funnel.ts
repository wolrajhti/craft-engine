import { Funnel } from '../../src/domain/funnel';
import { Rect } from '../../src/domain/rect';
import { Vector2 } from '../../src/domain/vector2';

describe('Funnel', () => {
  describe('cas 1', () => {
    //   012345678 9101214 1618202224 26283032
    //               111315 17192123 2527293133
    //
    // 0                     55 E 55 MS
    //                               ---------
    // 1 111111111|                  LR 444444
    // 2 1111111 L|M 22222           444444444
    // 3 111 S 111|22222 L|M 33333 L|M 4444444
    // 4 1111111 R|S 22222|333333333|444444444
    // 5           2222222|3333333 R|S 4444444
    // 6           22222 R|S 3333333
    //
    // SOLUTION ATTENDUE
    //   012345678 9101214 1618202224 26283032
    //               111315 17192123 2527293133
    //
    // 0                        E    LR
    //                               ---------
    // 1          |                   R
    // 2          |L
    // 3     S    |      L|        L|L
    // 4          |R      |         |
    // 5                  |        R|
    // 6                  |R
    const start = new Vector2(4, 3);
    const end = new Vector2(21, 0);
    const rects = [
      new Rect(0, 1, 9, 4),
      new Rect(9, 2, 7, 5),
      new Rect(16, 3, 9, 4),
      new Rect(25, 1, 9, 5),
      new Rect(18, 0, 9, 1),
    ];
    const funnel = new Funnel(rects, start, end);

    test('buildCandidates', () => {
      const candidates = funnel.buildCandidates();
      expect(candidates.left.length).toBe(8);

      expect(Vector2.equalsRaw(candidates.left[0].x, candidates.left[0].y, 8, 2)).toBeTruthy();
      expect(Vector2.equalsRaw(candidates.left[1].x, candidates.left[1].y, 9, 2)).toBeTruthy();
      expect(Vector2.equalsRaw(candidates.left[2].x, candidates.left[2].y, 15, 3)).toBeTruthy();
      expect(Vector2.equalsRaw(candidates.left[3].x, candidates.left[3].y, 16, 3)).toBeTruthy();
      expect(Vector2.equalsRaw(candidates.left[4].x, candidates.left[4].y, 24, 3)).toBeTruthy();
      expect(Vector2.equalsRaw(candidates.left[5].x, candidates.left[5].y, 25, 3)).toBeTruthy();
      expect(Vector2.equalsRaw(candidates.left[6].x, candidates.left[6].y, 25, 1)).toBeTruthy();
      expect(Vector2.equalsRaw(candidates.left[7].x, candidates.left[7].y, 25, 0)).toBeTruthy();

      expect(Vector2.equalsRaw(candidates.right[0].x, candidates.right[0].y, 8, 4)).toBeTruthy();
      expect(Vector2.equalsRaw(candidates.right[1].x, candidates.right[1].y, 9, 4)).toBeTruthy();
      expect(Vector2.equalsRaw(candidates.right[2].x, candidates.right[2].y, 15, 6)).toBeTruthy();
      expect(Vector2.equalsRaw(candidates.right[3].x, candidates.right[3].y, 16, 6)).toBeTruthy();
      expect(Vector2.equalsRaw(candidates.right[4].x, candidates.right[4].y, 24, 5)).toBeTruthy();
      expect(Vector2.equalsRaw(candidates.right[5].x, candidates.right[5].y, 25, 5)).toBeTruthy();
      expect(Vector2.equalsRaw(candidates.right[6].x, candidates.right[6].y, 26, 1)).toBeTruthy();
      expect(Vector2.equalsRaw(candidates.right[7].x, candidates.right[7].y, 26, 0)).toBeTruthy();
    });

    test('getEntryPoints R1 - R2', () => {
      const candidates = funnel.buildCandidates();

      let left = start;
      let right = start;

      [left, right] = funnel.getEntryPoints(
        left, candidates.left[0], candidates.left[1],
        right, candidates.right[0], candidates.right[1]
      );
      expect(left.equals(candidates.left[1])).toBeTruthy();
      expect(right.equals(candidates.right[1])).toBeTruthy();

      [left, right] = funnel.getEntryPoints(
        left, candidates.left[2], candidates.left[3],
        right, candidates.right[2], candidates.right[3],
      );
      expect(left.equals(candidates.left[2])).toBeTruthy();
      expect(right.equals(candidates.right[3])).toBeTruthy();

      [left, right] = funnel.getEntryPoints(
        left, candidates.left[3], candidates.left[4],
        right, candidates.right[4], candidates.right[5],
      );
      expect(left.equals(candidates.left[4])).toBeTruthy();
      expect(right.equals(candidates.right[4])).toBeTruthy();

      [left, right] = funnel.getEntryPoints(
        left, candidates.left[5], candidates.left[6],
        right, candidates.right[5], candidates.right[6],
      );
      expect(left.equals(candidates.left[5])).toBeTruthy();
      expect(right.equals(candidates.right[6])).toBeTruthy();

      [left, right] = funnel.getEntryPoints(
        left, candidates.left[6], candidates.left[7],
        right, candidates.right[7], candidates.right[7],
      );
      expect(left.equals(candidates.left[7])).toBeTruthy();
      expect(right.equals(candidates.right[7])).toBeTruthy();
    });

    // test('build', () => {
    //   const apex = funnel.build();
    //   console.log(apex);
    // });
  });
});