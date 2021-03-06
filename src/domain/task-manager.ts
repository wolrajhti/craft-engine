import { Ingredients } from './ingredients';
import { Source, TSourceData } from './source';
import { ItemHolder } from './item-holder';
import { Item } from './item';
import { Recipe } from './recipe';
import { Proportions, TProportionsData } from './proportions';
import { Container } from './container';
import { Cook, GoToCallbackFn } from './cook';
import { Furniture } from './furniture';
import { Stock } from './stock';
import { Job } from './job';

export class TaskManager {
  private _jobs: Job[] = [];
  constructor(
    private _itemHolders: ItemHolder[],
    private _recipes: Recipe[],
  ) {
    setInterval(() => {
      if (!!this._jobs.length) {
        const job = this._jobs.shift() as Job;
        if (!job.isProcessing) {
          const recipe = job.recipe;
          const missing = this.getProportions().getMissing(recipe.getInputs());
          console.log(missing.log());
          if (!missing.getNorm()) {
            console.log('executing', recipe.log());
            const bestItemHolders = this.getBestItemHoldersFor(recipe.getInputs(), job.x, job.y);
            const cook = TaskManager.GetTheCook(bestItemHolders.containers());
            this.execute(job, bestItemHolders, cook, cook).then(() => {
              const i = this._jobs.findIndex(j => job === j);
              if (i !== -1) {
                this._jobs.splice(i, 1);
              }
              console.log('recipe', recipe.log(), 'executed !');
            });
          } else {
            if (!job.isSplitted) {
              const recipes = this.getBestRecipesFor(missing);
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
  }
  static GetTheCook(itemHolders: ItemHolder[]): Cook {
    const cook = itemHolders.find(itemHolder => itemHolder instanceof Cook);
    if (!cook) {
      throw new Error('Missing cook');
    }
    return cook as Cook;
  }
  async execute(
    job: Job,
    src: TSourceData<ItemHolder>,
    cook: Cook,
    dest: ItemHolder,
    goToCallbackFn?: GoToCallbackFn
  ): Promise<void> {
    const result = new Ingredients();
    if (!(src instanceof Source)) {
      src = new Source(src);
    }
    job.markAsProcessing();
    for (const container of src.containers()) {
      await cook.goTo(container, goToCallbackFn);
      const ingredients = container.removeItems(src.ofContainer(container));
      ingredients.forEachKind((items, kind) => {
        result.addItem(kind, ...items);
      });
    }
    const outputs = job.recipe.execute(result);
    await cook.goTo(dest, goToCallbackFn);
    outputs.forEachKind((items, kind) => {
      dest.addItems([[kind, items]]);
    });
  }
  getProportions(): Proportions {
    let result = new Proportions();
    this._itemHolders.forEach(itemHolder => {
      result = result.add(itemHolder.getProportions());
    });
    return result;
  }
  private static getBestFor<T extends Container>(containers: T[], proportions: TProportionsData, x = 0, y = 0): Source<T> {
    if (!(proportions instanceof Proportions)) {
      proportions = new Proportions(proportions);
    }
    const scores = new Map<T, number>(containers.map(container => [container, 0]));
    containers.forEach(container => {
      scores.set(container, container.scoreFor(proportions as Proportions, x, y));
    });
    const sortedContainers = [...scores]
      .sort(([, score1], [, score2]) => score1 - score2)
      .map(([container]) => container);
    const result: [T, Proportions][] = [];
    for (const container of sortedContainers) {
      const missing = container.getProportions().getMissing(proportions);
      const partial = proportions.sub(missing);
      if (!partial.isEmpty()) {
        result.push([container, partial]);
      }
      proportions = missing;
    }
    if (proportions.isEmpty()) {
      return new Source<T>(result);
    } else {
      return new Source<T>();
    }
  }
  getBestItemHoldersFor(proportions: TProportionsData, x: number, y: number): Source<ItemHolder> {
    return TaskManager.getBestFor<ItemHolder>(this._itemHolders, proportions, x, y);
  }
  getBestRecipesFor(proportions: TProportionsData): Source<Recipe> {
    return TaskManager.getBestFor<Recipe>(this._recipes, proportions);
  }
  createRecipe(inputs: TProportionsData, outputs: TProportionsData = new Proportions()): Recipe {
    const recipe = new Recipe(inputs, outputs);
    this._recipes.push(recipe);
    return recipe;
  }
  createItemHolder(type: 'c' | 's' | 'f', x: number, y: number, speed?: number): ItemHolder {
    let itemHolder: ItemHolder;
    switch(type) {
      case 'c': {
        itemHolder = new Cook([], x, y, speed);
        break;
      }
      case 's': {
        itemHolder = new Stock([], x, y);
        break;
      }
      case 'f': {
        itemHolder = new Furniture([], x, y);
        break;
      }
    }
    this._itemHolders.push(itemHolder);
    return itemHolder;
  }
  createItemsIn(itemHolder: ItemHolder | number, proportions: TProportionsData): Ingredients {
    if (!(proportions instanceof Proportions)) {
      proportions = new Proportions(proportions);
    }
    if (!(itemHolder instanceof ItemHolder)) {
      const foundedItemHolder = this._itemHolders.find(iH => iH.uuid === itemHolder);
      if (foundedItemHolder) {
        itemHolder = foundedItemHolder;
      } else {
        throw new Error('unknown itemHolder');
      }
    }
    return new Ingredients(
      proportions.content()
        .map(([kind, quantity]) => {
          const item = new Item({kinds: [kind], quantity});
          (itemHolder as ItemHolder).addItem(kind, item);
          return [kind, [item]];
        })
    );
  }
  addJob(job: Job): void {
    this._jobs.push(job);
  }
}
