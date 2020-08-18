import { ItemHolder } from './item-holder';
import { Item } from './item';

export class Cook extends ItemHolder {
  constructor(
    data: [string, Item[]][] = [],
    x?: number,
    y?: number,
    public readonly speed = 1,
  ) {
    super(data, x, y);
  }
  async goTo(itemHolder: ItemHolder): Promise<void> {
    const dist = Math.sqrt(
      (itemHolder.x - this.x) * (itemHolder.x - this.x) +
      (itemHolder.y - this.y) * (itemHolder.y - this.y)
    );
    await new Promise(resolve => setTimeout(resolve, dist * this.speed));
  }
}