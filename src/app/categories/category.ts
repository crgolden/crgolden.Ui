import { Model } from '@clarity/models';

export class Category extends Model {
  id?: string;
  name: string;
  description?: string;
}
