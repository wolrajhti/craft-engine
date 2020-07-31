import { TaskManager } from '../domain/task-manager';
import { Recipe } from '../domain/recipe';

const taskManager = new TaskManager([], []);

taskManager.createRecipe(['a', 'b', 'c', 'd'], ['e']);
taskManager.createRecipe(['a', 'b', 'e', 'f'], ['g']);
taskManager.createRecipe(['a', 'b', 'g', 'h'], ['i']);

// cuistot
const itemHolder1 = taskManager.createItemHolder();
taskManager.createItemsIn(itemHolder1, 'a', 'a', 'a');
// plan de travail
const itemHolder2 = taskManager.createItemHolder();
taskManager.createItemsIn(itemHolder2, 'b', 'b', 'b');
// réfrigérateur 1
const itemHolder3 = taskManager.createItemHolder();
taskManager.createItemsIn(itemHolder3, 'c');
// réfrigérateur 2
const itemHolder4 = taskManager.createItemHolder();
taskManager.createItemsIn(itemHolder4, 'd');
// réfrigérateur 3
const itemHolder5 = taskManager.createItemHolder();
taskManager.createItemsIn(itemHolder5, 'f');
// réfrigérateur 4
const itemHolder6 = taskManager.createItemHolder();
taskManager.createItemsIn(itemHolder6, 'h');

const todo: Recipe[] = [new Recipe(['i'], [])];

while (todo.length) {
  const recipe = todo.shift();
  if (recipe) {
    console.log('---', recipe.log(), '---');
    const missingKinds = taskManager.getMissing(...recipe.getInputs());
    console.log('missing', missingKinds);
    if (!missingKinds.length) {
      taskManager.execute(recipe, taskManager.getBestItemHoldersFor(...recipe.getInputs()), itemHolder6);
      console.log('recipe executed !');
    } else {
      if (!recipe.isSplitted()) {
        const recipes = taskManager.getBestRecipesFor(...missingKinds) as Recipe[];
        console.log('splitting task into :', recipes.map(r => r.log()));
        recipe.markAsSplitted();
        todo.push(...recipes);
      }
      todo.push(recipe);
    }
  }
}
