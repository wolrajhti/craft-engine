import { IItem } from './item';

export interface IItemHolder {
  contains(...kinds: string[]): boolean;
  addItems(...items: IItem[]): void;
  removeItems(...kinds: string[]): IItem[];
}