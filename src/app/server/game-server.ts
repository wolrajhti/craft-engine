import { Socket } from 'socket.io';
import { TaskManager } from '../../domain/task-manager';
import { TProportionsInput } from '../../domain/proportions';
import { Job } from '../../domain/job';
import { Recipe } from '../../domain/recipe';
import { Item } from '../../domain/item';

export class GameServer {
  private _taskManager: TaskManager;
  constructor(private _socket: Socket) {
    this._taskManager = new TaskManager([], []);

    this._taskManager.createRecipe(['C1', 'F1', 'I1', 'I2'], 'I3');
    this._taskManager.createRecipe(['C1', 'F1', 'I3', 'I4'], 'I5');
    this._taskManager.createRecipe(['C1', 'F1', 'I6', 'I7'], 'I8');
    this._taskManager.createRecipe(['C1', 'F1', 'I5', 'I8'], 'I9');

    this._socket.emit('log', 'test');
    this._socket.on('addItemHolder', (type, x, y, speed) => this.addItemHolder(type, x, y, speed));
    this._socket.on('addItemsIn', (itemHolders: number[], proportions) => {
      itemHolders.forEach(itemHolderUuid => {
        this.addItemsIn(itemHolderUuid, proportions);
      });
    });
    this._socket.on('addJob', asked => {
      this.addJob(asked);
    });
  }
  addItemHolder(type:  'c' | 'f' | 's', x: number, y: number, speed?: number) {
    console.log('addItemHolder', type);
    const itemHolder = this._taskManager.createItemHolder(type, x, y, speed);
    // add I1 for all cook
    if (type === 'c') {
      itemHolder.addItem('C1', new Item({kinds: 'C1', quantity: Infinity}));
    }
    // add I2 for all furniture
    if (type === 'f') {
      itemHolder.addItem('F2', new Item({kinds: 'F2', quantity: Infinity}));
    }
    this._socket.emit('entity', type, itemHolder.uuid, itemHolder.x, itemHolder.y);
  }
  addItemsIn(itemHolderUuid: number, proportions: TProportionsInput) {
    this._taskManager.createItemsIn(itemHolderUuid, proportions);
  }
  addJob(asked: string): void {
    this._taskManager.addJob(new Job(new Recipe(asked)));
  }
}