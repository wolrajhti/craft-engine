import { IContainer } from './interfaces/container';

import { Proportions } from './proportions';

export abstract class Container implements IContainer {
  abstract getProportions(): Proportions;
}