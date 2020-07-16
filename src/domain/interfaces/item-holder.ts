import { IItem } from './item';

export interface IItemHolder {
  contains(...kinds: string[]): boolean;
  getMissing(...kinds: string[]): string[];
  addItems(...items: IItem[]): void;
  removeItems(...kinds: string[]): IItem[];
}