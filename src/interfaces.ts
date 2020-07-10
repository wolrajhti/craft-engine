// import { IItem } from './item';


// export interface ItemTaker {
//   take(item: Item, from: ItemHolder): Item;
// }

// export interface ITask {
//   output: IItem;
//   progress: number;
//   processing: boolean;
//   getCandidates(itemHolders: IItemHolder[]): IItemHolder[];
//   getCandidatePairs(itemHolders: IItemHolder[]): [IItemHolder, IItemHolder][];
//   decompose(): [ITask, ITask];
// }

// export class Task implements ITask {
//   public progress = 0;
//   public processing = false;
//   constructor(
//     public output: IItem,

//   ) {
//   }

//   getCandidates(itemHolders: IItemHolder[]): IItemHolder[] {
//     return itemHolders.filter(itemHolder => {
//       return itemHolder.contains(this.output.input1, this.output.input2);
//     });
//   }
// }
// export interface TaskExecutor {
//   canDo(task: Task): boolean;
//   do(task: Task, itemHolder: ItemHolder): Item;
// }
