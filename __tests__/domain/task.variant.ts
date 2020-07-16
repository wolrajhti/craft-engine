import { TaskVariant } from '../../src/domain/task.variant';
import { Item } from '../../src/domain/item';

describe('Task', () => {
  const input1 = 'a';
  const input2 = 'b';
  const output = 'c';
  const task = new TaskVariant(input1, input2, output);

  test('getInputs()', () => {
    expect(task.getInputs()).toStrictEqual([input1, input2]);
  });

  test('getOutputs()', () => {
    expect(task.getOutputs()[0].getKind()).toStrictEqual(output);
  });
});
