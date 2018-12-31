import { BaseModel } from '../base/base-model';
import { OrderProduct } from '../order-products/order-product';
import { Payment } from '../payments/payment';

export class Order extends BaseModel {
  userId: string;
  shippingAddress?: string;
  total: number;
  orderProducts: Array<OrderProduct>;
  payments: Array<Payment>;
}
