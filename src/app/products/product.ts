import { BaseModel } from '../base/base-model';
import { CartProduct } from '../cart-products/cart-product';
import { OrderProduct } from '../order-products/order-product';
import { ProductFile } from '../product-files/product-file';
import { ProductCategory } from '../product-categories/product-category';

export class Product extends BaseModel {
  active: boolean;
  description?: string;
  unitPrice: number;
  quantityPerUnit: string;
  unitsInStock?: number;
  unitsOnOrder?: number;
  reorderLevel?: number;
  isDownload: boolean;
  cartProducts: Array<CartProduct>;
  orderProducts: Array<OrderProduct>;
  productFiles: Array<ProductFile>;
  productCategories: Array<ProductCategory>;
}
