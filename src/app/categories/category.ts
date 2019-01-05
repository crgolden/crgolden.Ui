import { BaseModel } from '../base/base-model';
import { ProductCategory } from '../product-categories/product-category';

export class Category extends BaseModel {
  description: string;
  productCategories: Array<ProductCategory>;
}
