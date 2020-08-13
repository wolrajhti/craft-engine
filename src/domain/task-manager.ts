import { Ingredients } from './ingredients';
import { Source, TSourceData } from './source';
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
  execute(recipe: Recipe, src: TSourceData<ItemHolder>, dest: ItemHolder): void {
    const result = new Ingredients();
    if (!(src instanceof Source)) {
      src = new Source(src);
    }
    src.forEachContainer((proportions, itemHolder) => {
      const ingredients = itemHolder.removeItems(proportions);
      ingredients.forEachKind((items, kind) => {
        result.addItem(kind, ...items);
      });
    });
    const outputs = recipe.execute(result);
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
      proportions.content()
        .map(([kind, quantity]) => {
          const item = new Item({kinds: [kind], quantity});
          itemHolder.addItem(kind, item);
          return [kind, [item]];
        })
    );
  }
}
