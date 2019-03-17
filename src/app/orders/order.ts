import { Model } from '@clarity/core-models';
import { Address } from '@clarity/core-claims';

export class Order extends Model {
  id?: string;
  number?: number;
  userId?: string;
  shippingAddress?: Address;
  shipping?: number;
  tax?: number;
  total: number;

  constructor(
    total: number,
    shippingAddress?: Address,
    shipping?: number,
    tax?: number) {
    super();
    this.total = total;
    this.shippingAddress = shippingAddress;
    this.shipping = shipping;
    this.tax = tax;
  }
}
