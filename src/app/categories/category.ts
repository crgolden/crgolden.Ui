import { Model } from '@crgolden/core-models';

export class Category extends Model {
  id?: string;
  name: string;
  description?: string;
}
