import { IItem } from './item';
import { IItemHolder } from './item-holder';
import { ITask } from './task';

export interface ITaskManager {
  execute(task: ITask, itemHolder: IItemHolder): IItem[];
  getValidCandidates(task: ITask): IItemHolder[];
  getCandidates(task: ITask): IItemHolder[];
  contains(...kinds: string[]): boolean;
  getMissing(...kinds: string[]): string[];
  split(task: ITask): ITask[];
}
