import { Model } from '@clarity/core-models';

export class Category extends Model {
  id?: string;
  name: string;
  description?: string;
}
