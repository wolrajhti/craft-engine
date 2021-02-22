import { Funnel } from '../../src/domain/funnel';
import { Rect } from '../../src/domain/rect';
import { Vector2 } from '../../src/domain/vector2';

describe('Funnel', () => {
  describe('cas 1', () => {
    //     0 1 2 3 4 5 6 7 8 9 10  12  14  16  18  20  22  24  26  28  30  32
    //                           11  13  15  17  19  21  23  25  27  29  31  33
    //
    // 0                                       5 5 5 5 E 5 5 M S
    // 1   1 1 1 1 1 1 1 1 1                                 L R 4 4 4 4 4 4 4
    // 2   1 1 1 1 1 1 1 1 L M 2 2 2 2 2 2                   4 4 4 4 4 4 4 4 4
    // 3   1 1 1 S 1 1 1 1 1 2 2 2 2 2 2 L M 3 3 3 3 3 3 3 L M 4 4 4 4 4 4 4 4
    // 4   1 1 1 1 1 1 1 1 R S 2 2 2 2 2 2 3 3 3 3 3 3 3 3 3 4 4 4 4 4 4 4 4 4
    // 5                     2 2 2 2 2 2 2 3 3 3 3 3 3 3 3 R S 4 4 4 4 4 4 4 4
    // 6                     2 2 2 2 2 2 R S 3 3 3 3 3 3 3 3
    //
    // SOLUTION ATTENDUE
    //     0 1 2 3 4 5 6 7 8 9 10  12  14  16  18  20  22  24  26  28  30  32
    //                           11  13  15  17  19  21  23  25  27  29  31  33
    //
    // 0                                               E     L R
    // 1                                                       R
    // 2                    |L
    // 3       S            |            L|                L|L
    // 4                    |R            |                 |
    // 5                                  |                R|
    // 6                                  |R
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