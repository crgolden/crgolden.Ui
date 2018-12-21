import { BaseModel } from '../base/base-model';
import { CartProduct } from '../cart-products/cart-product';
import { OrderProduct } from '../relationships/order-product';

export class Product extends BaseModel {
  description?: string;
  price: number;
  pictureFileName?: string;
  pictureUri?: string;
  cartProducts: Array<CartProduct>;
  orderProducts: Array<OrderProduct>;
}