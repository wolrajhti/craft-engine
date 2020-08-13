import { Proportions } from './proportions';

export abstract class Container {
  abstract getProportions(): Proportions;
  abstract scoreFor(proportions: Proportions, x: number, y: number): number;
}