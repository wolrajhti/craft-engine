import { Recipe } from '../../src/domain/recipe';
import { Proportions } from '../../src/domain/proportions';

describe('Recipe', () => {
  const inputs = new Proportions(['a', 'b', 'c']);
  const outputs = new Proportions(['d', 'e', 'f']);
  const recipe = new Recipe(inputs, outputs);

  test('getInputs()', () => {
    expect(recipe.getInputs()).toStrictEqual(inputs);
  });

  test('getOutputs()', () => {
    expect(recipe.getOutputs()).toStrictEqual(outputs);
  });

  test('getProportions()', () => {
    expect(recipe.getProportions()).toStrictEqual(outputs);
  });
});
