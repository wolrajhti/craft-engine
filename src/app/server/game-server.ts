import { Socket } from 'socket.io';
import { TaskManager } from '../../domain/task-manager';
import { ItemHolder } from '../../domain/item-holder';
import { TProportionsData, TProportionsInput } from '../../domain/proportions';

export class GameServer {
  private _taskManager: TaskManager;
  constructor(private _socket: Socket) {
    this._taskManager = new TaskManager([], []);
    this._socket.emit('log', 'test');
    this._socket.on('addItemHolder', (type, x, y, speed) => this.addItemHolder(type, x, y, speed));
    this._socket.on('addItemsIn', (itemHolder, proportions) => this.addItemsIn(itemHolder, proportions));
  }
  addItemHolder(type:  'c' | 'f' | 's', x: number, y: number, speed?: number) {
    console.log('addItemHolder', type);
    const itemHolder = this._taskManager.createItemHolder(type, x, y, speed);
    this._socket.emit('entity', type, itemHolder.uuid, itemHolder.x, itemHolder.y);
  }
  addItemsIn(itemHolder: number, proportions: TProportionsInput) {
    this._taskManager.createItemsIn(itemHolder, proportions);
  }
}