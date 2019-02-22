import { Entity } from '@clarity/entities';
import { Address } from '../address/address';
import { OrderProduct } from '../order-products/order-product';
import { Payment } from '../payments/payment';

export class Order extends Entity {
  id: string;
  number: number;
  userId: string;
  shippingAddress?: Address;
  total: number;
  orderProducts: Array<OrderProduct>;
  payments: Array<Payment>;
}
