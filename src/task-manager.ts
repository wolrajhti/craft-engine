import { IItem } from './item';
import { IItemHolder } from './item-holder';
import { ITask } from './task';

export interface ITaskManager {
  execute(task: ITask): IItem[];
  getValidCandidates(task: ITask): IItemHolder[];
  getCandidates(task: ITask): IItemHolder[];
}
