import { Proportions } from './proportions';

export abstract class Container {
  abstract getProportions(): Proportions;
}