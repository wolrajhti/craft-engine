import { ItemHolder } from './item-holder';
import { Item } from './item';


export type GoToCallbackFn = (
  x1: number, y1: number,
  x2: number, y2: number,
  speed: number
) => Promise<void>;

export class Cook extends ItemHolder {
  private static readonly defaultGoToCallbackFn: GoToCallbackFn = async (
    x1: number, y1: number,
    x2: number, y2: number,
    speed: number
  ): Promise<void> => {
    const dist = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
    console.log(
      '\t=> cook is moving from', x1.toFixed(), y1.toFixed(),
      'to', x2.toFixed(), y2.toFixed(),
      '(in ', ((dist / speed) * 1000).toFixed(), 's)');
    await new Promise(resolve => setTimeout(resolve, (dist / speed) * 1000));
  };

  constructor(
    data: [string, Item[]][] = [],
    x?: number,
    y?: number,
    public readonly speed = 1,
  ) {
    super(data, x, y);
  }
  async goTo(itemHolder: ItemHolder, callbackFn: GoToCallbackFn = Cook.defaultGoToCallbackFn): Promise<void> {
    await callbackFn(this.x, this.y, itemHolder.x, itemHolder.y, this.speed);
    this._x = itemHolder.x;
    this._y = itemHolder.y;
  }
}