import { BaseModel } from '../base/base-model';
import { CartProduct } from '../cart-products/cart-product';
import { OrderProduct } from '../order-products/order-product';
import { ProductFile } from '../product-files/product-file';

export class Product extends BaseModel {
  active: boolean;
  description?: string;
  price: number;
  pictureFileName?: string;
  pictureUri?: string;
  isDownload: boolean;
  cartProducts: Array<CartProduct>;
  orderProducts: Array<OrderProduct>;
  productFiles: Array<ProductFile>;
}
