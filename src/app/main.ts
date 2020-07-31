import { TaskManager } from '../domain/task-manager';

const taskManager = new TaskManager([], []);

taskManager.createRecipe(['a', 'b', 'c', 'd'], ['e']);
taskManager.createRecipe(['a', 'b', 'e', 'f'], ['g']);
taskManager.createRecipe(['a', 'b', 'g', 'h'], ['i']);

// cuistot
const itemHolder1 = taskManager.createItemHolder();
taskManager.createItemIn(itemHolder1, 'a');
// plan de travail
const itemHolder2 = taskManager.createItemHolder();
taskManager.createItemIn(itemHolder2, 'b');
// réfrigérateur 1
const itemHolder3 = taskManager.createItemHolder();
taskManager.createItemIn(itemHolder3, 'c');
// réfrigérateur 2
const itemHolder4 = taskManager.createItemHolder();
taskManager.createItemIn(itemHolder4, 'd');
// réfrigérateur 3
const itemHolder5 = taskManager.createItemHolder();
taskManager.createItemIn(itemHolder5, 'f');
// réfrigérateur 4
const itemHolder6 = taskManager.createItemHolder();
taskManager.createItemIn(itemHolder6, 'h');

const list = [];
const todo = [['i']];
let i = 0;

while (todo.length && i < 1e3) {
  const kinds = todo.shift();
  console.log('KINDS', ...kinds);
  const missingKinds = taskManager.getMissing(...kinds);
  if (!missingKinds.length) {
    list.push(taskManager.getBestItemHoldersFor(...kinds));
  } else {
    const recipes = taskManager.getBestRecipesFor(...missingKinds);
    recipes.forEach(recipe => {
      todo.push(recipe.getInputs());
      list.push(recipe);
    });
  }
  i++;
}

console.log(list);