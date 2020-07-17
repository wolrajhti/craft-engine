export interface IContainer {
  contains(...kinds: string[]): boolean;
  getMissing(...kinds: string[]): string[];
}