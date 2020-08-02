export interface IItem {
  getKind(): string;
  equals(other: IItem): boolean;
}