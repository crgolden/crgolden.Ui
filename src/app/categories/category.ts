import { Entity } from '@clarity/entities';
import { ProductCategory } from '../product-categories/product-category';

export class Category extends Entity {
  id: string;
  name: string;
  description: string;
  productCategories: Array<ProductCategory>;
}
