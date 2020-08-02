import { TaskManager } from '../domain/task-manager';
import { Recipe } from '../domain/recipe';
import { Proportions } from '../domain/proportions';

const taskManager = new TaskManager([], []);

taskManager.createRecipe(new Proportions(['a', 'b', 'c', 'd']), new Proportions('e'));
taskManager.createRecipe(new Proportions(['a', 'b', 'e', 'f']), new Proportions('g'));
taskManager.createRecipe(new Proportions(['a', 'b', 'g', 'h']), new Proportions('i'));

// cuistot
const itemHolder1 = taskManager.createItemHolder();
taskManager.createItemsIn(itemHolder1, new Proportions([['a', 3]]));
// plan de travail
const itemHolder2 = taskManager.createItemHolder();
taskManager.createItemsIn(itemHolder2, new Proportions([['b', 3]]));
// réfrigérateur 1
const itemHolder3 = taskManager.createItemHolder();
taskManager.createItemsIn(itemHolder3, new Proportions('c'));
// réfrigérateur 2
const itemHolder4 = taskManager.createItemHolder();
taskManager.createItemsIn(itemHolder4, new Proportions('d'));
// réfrigérateur 3
const itemHolder5 = taskManager.createItemHolder();
taskManager.createItemsIn(itemHolder5, new Proportions('f'));
// réfrigérateur 4
const itemHolder6 = taskManager.createItemHolder();
taskManager.createItemsIn(itemHolder6, new Proportions('h'));

const todo: Recipe[] = [new Recipe(new Proportions('i'), new Proportions())];

while (todo.length) {
  const recipe = todo.shift();
  if (recipe) {
    console.log('---', recipe.log(), '---');
    const missing = taskManager.getProportions().getMissing(recipe.getInputs());
    console.log('missing', missing.log(), missing.getNorm());
    if (!missing.getNorm()) {
      taskManager.execute(recipe, taskManager.getBestItemHoldersFor(recipe.getInputs()), itemHolder6);
      console.log('recipe executed !');
    } else {
      if (!recipe.isSplitted()) {
        const recipes = taskManager.getBestRecipesFor(missing);
        console.log('splitting task into :', [...recipes.keys()].map(r => r.log()));
        recipe.markAsSplitted();
        todo.push(...recipes.keys());
      }
      todo.push(recipe);
    }
  }
}
