import { Socket } from 'socket.io';
import { TaskManager } from '../../domain/task-manager';
import { TProportionsInput } from '../../domain/proportions';
import { Job } from '../../domain/job';
import { Recipe } from '../../domain/recipe';

export class GameServer {
  private _taskManager: TaskManager;
  private _jobs: Job[] = [];
  constructor(private _socket: Socket) {
    this._taskManager = new TaskManager([], []);

    this._taskManager.createRecipe(['I1', 'I2'], 'I3');
    this._taskManager.createRecipe(['I3', 'I4'], 'I5');

    setInterval(() => {
      if (!!this._jobs.length) {
        const job = this._jobs.shift() as Job;
        if (!job.isProcessing) {
          const recipe = job.recipe;
          const missing = this._taskManager.getProportions().getMissing(recipe.getInputs());
          if (!missing.getNorm()) {
            console.log('executing', recipe.log());
            const bestItemHolders = this._taskManager.getBestItemHoldersFor(recipe.getInputs(), job.x, job.y);
            const cook = TaskManager.GetTheCook(bestItemHolders.containers());
            this._taskManager.execute(job, bestItemHolders, cook, cook).then(() => {
              const i = this._jobs.findIndex(j => job === j);
              if (i !== -1) {
                this._jobs.splice(i, 1);
              }
              console.log('recipe', recipe.log(), 'executed !');
            });
          } else {
            if (!job.isSplitted) {
              const recipes = this._taskManager.getBestRecipesFor(missing);
              console.log('splitting recipe', recipe.log(), 'into', [...recipes.containers()].map(r => r.log()));
              job.markAsSplitted();
              this._jobs.push(
                ...recipes.containers()
                  .map(recipe => new Job(recipe))
              );
            }
          }
        }
        this._jobs.push(job);
      }
    }, 50);

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
    this._socket.emit('entity', type, itemHolder.uuid, itemHolder.x, itemHolder.y);
  }
  addItemsIn(itemHolderUuid: number, proportions: TProportionsInput) {
    this._taskManager.createItemsIn(itemHolderUuid, proportions);
  }
  addJob(asked: string): void {
    this._jobs.push(new Job(new Recipe(asked)));
  }
}