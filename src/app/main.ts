import { TaskManager } from '../domain/task-manager';
import { Recipe } from '../domain/recipe';
import { Job } from '../domain/job';

const taskManager = new TaskManager([], []);

taskManager.createRecipe(['a', 'b', 'c', 'd'], 'e');
taskManager.createRecipe(['a', 'b', 'e', 'f'], 'g');
taskManager.createRecipe(['a', 'b', 'g', 'h'], 'i');

// cuistot
const itemHolder1 = taskManager.createItemHolder('c');
taskManager.createItemsIn(itemHolder1, [['a', 3]]);
// plan de travail
const itemHolder2 = taskManager.createItemHolder('f');
taskManager.createItemsIn(itemHolder2, [['b', 3]]);
// réfrigérateur 1
const itemHolder3 = taskManager.createItemHolder('s');
taskManager.createItemsIn(itemHolder3, [['b', 2], 'c']);
// réfrigérateur 2
const itemHolder4 = taskManager.createItemHolder('s');
taskManager.createItemsIn(itemHolder4, ['d', 'f']);
// réfrigérateur 3
const itemHolder5 = taskManager.createItemHolder('s');
taskManager.createItemsIn(itemHolder5, 'h');

const jobs = [new Job(new Recipe('i'))];

setInterval(() => {
  if (!!jobs.length) {
    const job = jobs.shift() as Job;
    const recipe = job.recipe;
    console.log('---', recipe.log(), '---');
    const missing = taskManager.getProportions().getMissing(recipe.getInputs());
    console.log('missing', missing.log(), missing.getNorm());
    if (!missing.getNorm()) {
      const bestItemHolders = taskManager.getBestItemHoldersFor(recipe.getInputs(), job.x, job.y);
      const cook = TaskManager.GetTheCook(bestItemHolders.containers());
      taskManager.execute(job, bestItemHolders, cook, cook).then(() => {
        const i = jobs.findIndex(j => job === j);
        if (i !== -1) {
          jobs.splice(i, 1);
        }
        console.log('recipe', recipe.log(), 'executed !');
      });
    } else {
      if (!job.isSplitted()) {
        const recipes = taskManager.getBestRecipesFor(missing);
        console.log('splitting task into :', [...recipes.containers()].map(r => r.log()));
        job.markAsSplitted();
        jobs.push(
          ...recipes.containers()
            .map(recipe => new Job(recipe))
        );
      }
    }
    jobs.push(job);
  }
}, 50);
