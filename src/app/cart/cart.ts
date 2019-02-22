import { Entity } from '@clarity/entities';
import { CartProduct } from '../cart-products/cart-product';

export class Cart extends Entity {
  id: string;
  userId?: string;
  total: number;
  cartProducts: Array<CartProduct>;
}
