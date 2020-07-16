import { Task } from '../../src/domain/task';

describe('Task', () => {
  const inputs = ['a', 'b', 'c'];
  const outputs = ['d', 'e', 'f'];
  const task = new Task(inputs, outputs);

  test('getInputs()', () => {
    expect(task.getInputs()).toStrictEqual(inputs);
  });

  test('getOutputs()', () => {
    const items = task.getOutputs();
    expect(items.every((item, i) => item.getKind() === outputs[i])).toBeTruthy();
  });
});
