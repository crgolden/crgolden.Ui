import { Entity } from '@clarity/entities';

export class ProductCategory extends Entity {
  productId: string;
  productName: string;
  categoryId: string;
  categoryName: string;
}
