import { TaskManager } from '../domain/task-manager';
import { Recipe } from '../domain/recipe';
import { Job } from '../domain/job';

const taskManager = new TaskManager([], []);

taskManager.createRecipe(['a', 'b', 'c', 'd'], 'e');
taskManager.createRecipe(['a', 'b', 'e', 'f'], 'g');
taskManager.createRecipe(['a', 'b', 'g', 'h'], 'i');

const random = (size: number) => size * (2 * Math.random() - 1);

// cuistot
const cook = taskManager.createItemHolder('c', random(1000), random(1000), 10 + 90 * Math.random());
taskManager.createItemsIn(cook, [['a', Infinity]]);
// plan de travail
const furniture = taskManager.createItemHolder('f', random(1000), random(1000));
taskManager.createItemsIn(furniture, 'b');
// réfrigérateur 1
const stock1 = taskManager.createItemHolder('s', random(1000), random(1000));
taskManager.createItemsIn(stock1, [['b', 2], 'c']);
// réfrigérateur 2
const stock2 = taskManager.createItemHolder('s', random(1000), random(1000));
taskManager.createItemsIn(stock2, ['d', 'f']);
// réfrigérateur 3
const stock3 = taskManager.createItemHolder('s', random(1000), random(1000));
taskManager.createItemsIn(stock3, 'h');

const jobs = [new Job(new Recipe('i'))];

setInterval(() => {
  if (!!jobs.length) {
    const job = jobs.shift() as Job;
    if (!job.isProcessing) {
      const recipe = job.recipe;
      const missing = taskManager.getProportions().getMissing(recipe.getInputs());
      if (!missing.getNorm()) {
        console.log('executing', recipe.log());
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
        if (!job.isSplitted) {
          const recipes = taskManager.getBestRecipesFor(missing);
          console.log('splitting recipe', recipe.log(), 'into', [...recipes.containers()].map(r => r.log()));
          job.markAsSplitted();
          jobs.push(
            ...recipes.containers()
              .map(recipe => new Job(recipe))
          );
        }
      }
    }
    jobs.push(job);
  }
}, 50);
