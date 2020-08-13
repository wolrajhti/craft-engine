import { TaskManager } from '../domain/task-manager';
import { Recipe } from '../domain/recipe';

const taskManager = new TaskManager([], []);

taskManager.createRecipe(['a', 'b', 'c', 'd'], 'e');
taskManager.createRecipe(['a', 'b', 'e', 'f'], 'g');
taskManager.createRecipe(['a', 'b', 'g', 'h'], 'i');

// cuistot
const itemHolder1 = taskManager.createItemHolder();
taskManager.createItemsIn(itemHolder1, 'a');
// plan de travail
const itemHolder2 = taskManager.createItemHolder();
taskManager.createItemsIn(itemHolder2, [['b', 3]]);
// réfrigérateur 1
const itemHolder3 = taskManager.createItemHolder();
taskManager.createItemsIn(itemHolder3, [['a', 2], 'c']);
// réfrigérateur 2
const itemHolder4 = taskManager.createItemHolder();
taskManager.createItemsIn(itemHolder4, ['d', 'f']);
// réfrigérateur 3
const itemHolder5 = taskManager.createItemHolder();
taskManager.createItemsIn(itemHolder5, 'h');

const todo = [
  new Recipe('i')
];

while (todo.length) {
  const recipe = todo.shift();
  if (recipe) {
    console.log('---', recipe.log(), '---');
    const missing = taskManager.getProportions().getMissing(recipe.getInputs());
    console.log('missing', missing.log(), missing.getNorm());
    if (!missing.getNorm()) {
      taskManager.execute(recipe, taskManager.getBestItemHoldersFor(recipe.getInputs()), itemHolder5);
      console.log('recipe executed !');
    } else {
      if (!recipe.isSplitted()) {
        const recipes = taskManager.getBestRecipesFor(missing);
        console.log('splitting task into :', [...recipes.containers()].map(r => r.log()));
        recipe.markAsSplitted();
        todo.push(...recipes.containers());
      }
      todo.push(recipe);
    }
  }
}
