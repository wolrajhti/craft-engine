export abstract class AbstractPathfinder<T> {
  abstract isDone(start: T, current: T, end: T): boolean;
  abstract getNeighboors(start: T, current: T, end: T): T[];
  abstract getScore(start: T, current: T, neighbor: T, end: T, currentScore: number): number;
  protected _getPath(start: T, end: T): T[] {
    const open: T[] = [start];
    const from = new Map<T, T>();
    const scores = new Map<T, number>([[start, 0]]); 
    const close = new Set<T>();

    let current = open.shift() as T;
    let score = scores.get(current) as number;
    
    // find way to goal
    while (!this.isDone(start, current, end)) {
      for (const neighbor of this.getNeighboors(start, current, end)) {
        if (!close.has(neighbor)) {
          score = this.getScore(start, current, neighbor, end, scores.get(current) as number);
          // update open list
          if (!scores.has(neighbor)) {
            from.set(neighbor, current);
            scores.set(neighbor, score);
            open.push(neighbor);
          } else if (score < (scores.get(neighbor) as number)) {
            from.set(neighbor, current);
            scores.set(neighbor, score);
          }
          // update close list
          close.add(neighbor);
        }
      }

      open.sort((n1, n2) => (scores.get(n1) as number) - (scores.get(n2) as number));

      if (!open.length) {
        break;
      }

      current = open.shift() as T;
    }

    const result: T[] = [];

    // reconstruct path
    while (true) {
      result.unshift(current);
      if (from.has(current)) {
        current = from.get(current) as T;
      } else {
        break;
      }
    }

    return result;
  }
}