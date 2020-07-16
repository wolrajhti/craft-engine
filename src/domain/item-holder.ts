import { IItemHolder } from './interfaces/item-holder';
import { IItem } from './interfaces/item';

export class ItemHolder implements IItemHolder {
  private _items: Map<string, IItem[]>;
  constructor() {
    this._items = new Map();
  }
  private _addItem(item: IItem): void {
    const kind = item.getKind();
    this._items.set(kind, [...(this._items.get(kind) || []), item]);
  }
  contains(...kinds: string[]): boolean {
    const count = new Map<string, number>();
    return kinds.every(kind => {
      if ((this._items.get(kind) || []).length - (count.get(kind) || 0)) {
        count.set(kind, (count.get(kind) || 0) + 1);
        return true;
      }
      return false;
    });
  }
  getMissing(...kinds: string[]): string[] {
    return kinds.filter(kind => !this.contains(kind));
  }
  addItems(...items: IItem[]): void {
    items.forEach(item => this._addItem(item));
  }
  removeItems(...kinds: string[]): IItem[] {
    return kinds.map(kind => {
      const items = this._items.get(kind);
      if (items && items.length) {
        return items.shift() as IItem;
      }
      throw new Error('Missing item');
    });
  }
  clear(): void {
    this._items.clear();
  }
}