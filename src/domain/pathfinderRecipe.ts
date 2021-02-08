// import { AbstractPathfinder } from './abstractPathfinder';
// import { Grid } from './grid';
// import { Rect } from './rect';

// type Todo = {
//   xy: [number, number]; // position courante de l'agent
//   todoList: string[]; // reste à collecter;
//   xyTodoList: [number, number][]; // position de chaque élément collecté
// };

// export class PathfinderRecipe extends AbstractPathfinder<Todo> {
//   private _tuples = new Map<number, Map<number, Todo>>();
//   constructor(
//     private grid: Grid,
//     private rects: Rect[],
//     private roughPath: Rect[]
//   ) {
//     super();
//   }
//   getTupleFor(x: number, y: number): Todo {
//     if (this._tuples.has(x)) {
//       if ((this._tuples.get(x) as Map<number, Todo>).has(y)) {
//         return (this._tuples.get(x) as Map<number, Todo>).get(y) as Todo;
//       }
//       (this._tuples.get(x) as Map<number, Todo>).set(y, [x, y]);
//       return (this._tuples.get(x) as Map<number, Todo>).get(y) as Todo;
//     }
//     this._tuples.set(x, new Map([[y, [x, y]]]));
//     return (this._tuples.get(x) as Map<number, Todo>).get(y) as Todo;
//   }
//   isDone(start: Todo, current: Todo, end: Todo): boolean {
//     return current.todoList === end;
//   }
//   getNeighboors(start: Todo, current: Todo, end: Todo): Todo[] {
//     const currentRect = this.rects[this.grid.i(...current)];
//     const currentRectIndex = this.roughPath.indexOf(currentRect);
//     if (currentRectIndex === this.roughPath.length - 1) {
//       return [this.getTupleFor(...end)];
//     } else {
//       return currentRect.borderWith(this.roughPath[currentRectIndex + 1])
//         .map(([x, y]) => this.getTupleFor(x, y));
//     }
//   }
//   getScore(start: Todo, current: Todo, neighbor: Todo, end: Todo, currentScore: number): number {
//     return currentScore + Math.sqrt(
//       Math.pow(neighbor[0] - current[0], 2) + Math.pow(neighbor[1] - current[1], 2)
//     )
//   }
//   getPath(sx: number, sy: number, ex: number, ey: number): Todo[] {
//     return super._getPath(
//       this.getTupleFor(sx, sy),
//       this.getTupleFor(ex, ey)
//     );
//   }
// }
