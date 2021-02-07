export abstract class AbstractPathfinder<T> {
  abstract isDone(current: T): boolean;
  abstract getNeighboors(current: T): T[];
  abstract getScore(current: T, neighbor: T, currentScore: number): number;
  protected _getPath(starts: T[]): T[] {
    const open: T[] = [...starts];
    const from = new Map<T, T>();
    const scores = new Map<T, number>(starts.map(start => [start, 0])); 
    const close = new Set<T>();

    open.sort((n1, n2) => (scores.get(n1) as number) - (scores.get(n2) as number));

    let current = open.shift() as T;
    let score: number;
    
    // find way to goal
    while (!this.isDone(current)) {
      for (const neighbor of this.getNeighboors(current)) {
        if (!close.has(neighbor)) {
          score = this.getScore(current, neighbor, scores.get(current) as number);
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