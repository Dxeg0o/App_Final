export interface CategoryProps {
  id: number;
  name: string;
}

export default class Category {
  id: number;
  name: string;

  constructor({ id, name }: CategoryProps) {
    this.id = id;
    this.name = name;
  }

  rename(newName: string): void {
    this.name = newName;
  }
}
