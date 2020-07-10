import { IItem } from '../../src/item';

export class ItemFake implements IItem {
  constructor(
    public kind: string,
  ) {}
}