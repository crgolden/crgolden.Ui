import { BaseModel } from '../base/base-model';
import { CartProduct } from '../cart-products/cart-product';

export class Cart extends BaseModel {
  userId?: string;
  total: number;
  cartProducts: Array<CartProduct>;
}
