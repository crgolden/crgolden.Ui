export abstract class BaseModel {
  id: string;
  name: string;

  protected constructor(
    id: string,
    name: string) {
    this.id = id;
    this.name = name;
  }
}
