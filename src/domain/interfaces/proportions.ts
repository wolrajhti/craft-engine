export interface IProportions extends Map<string, number> {
  getNorm(): number;
  isEmpty(): boolean;
  add(other: IProportions): IProportions;
  sub(other: IProportions): IProportions;
  mul(scale: number): IProportions;
  equals(other: IProportions): boolean;
  getMissing(other: IProportions): IProportions;
  contains(other: IProportions): boolean;
}
