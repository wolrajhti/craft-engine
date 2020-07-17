import { IItem } from './item';
import { IContainer } from './container';

export interface IItemHolder extends IContainer {
  addItems(...items: IItem[]): void;
  removeItems(...kinds: string[]): IItem[];
}