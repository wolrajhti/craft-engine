import { Socket } from 'socket.io';
import { TaskManager } from '../../domain/task-manager';

export class GameServer {
  private _taskManager: TaskManager;
  constructor(private _socket: Socket) {
    this._taskManager = new TaskManager([], []);
    this._socket.emit('log', 'test');
  }
}