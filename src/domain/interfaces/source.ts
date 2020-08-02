import { IProportions } from '../interfaces/proportions';
import { IContainer } from '../interfaces/container';

export interface ISource<T extends IContainer> extends Map<T, IProportions> {
  equals(other: ISource<T>): boolean;
}