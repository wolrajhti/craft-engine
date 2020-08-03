import { Ingredients } from './ingredients';
import { Source } from './source';
import { ItemHolder } from './item-holder';
import { Item } from './item';
import { Recipe } from './recipe';
import { Proportions, TProportionsData } from './proportions';
import { Container } from './container';

export class TaskManager {
  constructor(
    private _itemHolders: ItemHolder[],
    private _recipes: Recipe[],
  ) {}
  execute(recipe: Recipe, src: Source<ItemHolder>, dest: ItemHolder): void {
    const result = new Ingredients();
    src.forEach((proportions, itemHolder) => {
      const ingredients = itemHolder.removeItems(proportions);
      ingredients.forEach((items, kind) => {
        result.set(kind, [...(result.get(kind) || []), ...items])
      });
    });
    const outputs = recipe.execute(result);
    outputs.forEach((items, kind) => {
      dest.addItems(items);
    });
  }
  getProportions(): Proportions {
    let result = new Proportions();
    this._itemHolders.forEach(itemHolder => {
      result = result.add(itemHolder.getProportions());
    });
    return result;
  }
  private static getBestFor<T extends Container>(containers: T[], proportions: TProportionsData): Source<T> {
    if (!(proportions instanceof Proportions)) {
      proportions = new Proportions(proportions);
    }
    const scores = new Map<T, number>(containers.map(container => [container, 0]));
    containers.forEach(container => {
      const missing = container.getProportions().getMissing(proportions);
      scores.set(container, missing.getNorm());
    });
    const sortedContainers = [...scores]
      .sort(([, score1], [, score2]) => score1 - score2)
      .map(([container]) => container);
    const result = new Source<T>();
    for (const container of sortedContainers) {
      const missing = container.getProportions().getMissing(proportions);
      const partial = proportions.sub(missing);
      if (!partial.isEmpty()) {
        result.set(container, partial);
      }
      proportions = missing;
    }
    if (proportions.isEmpty()) {
      return result;
    } else {
      return new Source<T>();
    }
  }
  getBestItemHoldersFor(proportions: TProportionsData): Source<ItemHolder> {
    return TaskManager.getBestFor<ItemHolder>(this._itemHolders, proportions);
  }
  getBestRecipesFor(proportions: TProportionsData): Source<Recipe> {
    return TaskManager.getBestFor<Recipe>(this._recipes, proportions);
  }
  createRecipe(inputs: TProportionsData, outputs: TProportionsData = new Proportions()): Recipe {
    const recipe = new Recipe(inputs, outputs);
    this._recipes.push(recipe);
    return recipe;
  }
  createItemHolder(): ItemHolder {
    const itemHolder = new ItemHolder();
    this._itemHolders.push(itemHolder);
    return itemHolder;
  }
  createItemsIn(itemHolder: ItemHolder, proportions: TProportionsData): Ingredients {
    if (!(proportions instanceof Proportions)) {
      proportions = new Proportions(proportions);
    }
    return new Ingredients(
      [...proportions]
        .map(([kind, quantity]) => {
          const items: Item[] = [];
          for (let i = 0; i < quantity; i++) {
            const item = new Item(kind);
            items.push(item);
          }
          itemHolder.addItems(items);
          return [kind, items];
        })
    );
  }
}
