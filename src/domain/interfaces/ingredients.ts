import { IItem } from '../interfaces/item';

export interface IIngredients extends Map<string, IItem[]> {
  equals(other: IIngredients): boolean;
}
