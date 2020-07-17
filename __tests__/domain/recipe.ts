import { Recipe } from '../../src/domain/recipe';

describe('Recipe', () => {
  const inputs = ['a', 'b', 'c'];
  const outputs = ['d', 'e', 'f'];
  const recipe = new Recipe(inputs, outputs);

  test('getInputs()', () => {
    expect(recipe.getInputs()).toStrictEqual(inputs);
  });

  test('getOutputs()', () => {
    expect(recipe.getOutputs()).toStrictEqual(outputs);
  });
});
