import { Item } from '../domain/item';
import { ItemHolder } from '../domain/item-holder';
import { Recipe } from '../domain/recipe';
import { TaskManager } from '../domain/task-manager';

// cuistot
const itemHolder1 = new ItemHolder();
itemHolder1.addItems(new Item('a'));

// plan de travail
const itemHolder2 = new ItemHolder();
itemHolder2.addItems(new Item('b'));

// réfrigérateur 1
const itemHolder3 = new ItemHolder();
itemHolder3.addItems(new Item('c'));
// réfrigérateur 2
const itemHolder4 = new ItemHolder();
itemHolder4.addItems(new Item('d'));
// réfrigérateur 3
const itemHolder5 = new ItemHolder();
itemHolder5.addItems(new Item('f'));
// réfrigérateur 4
const itemHolder6 = new ItemHolder();
itemHolder6.addItems(new Item('h'));

const recipe1 = new Recipe(['a', 'b', 'c', 'd'], ['e']);
const recipe2 = new Recipe(['a', 'b', 'e', 'f'], ['g']);
const recipe3 = new Recipe(['a', 'b', 'g', 'h'], ['i']);

const taskManager = new TaskManager([
  itemHolder1,
  itemHolder2,
  itemHolder3,
  itemHolder4,
  itemHolder5,
  itemHolder6
], [
  recipe1,
  recipe2,
  recipe3
]);

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