import { Model } from '@crgolden/core-models';

export class Payment extends Model {
  id?: string;
  userId?: string;
  chargeId?: string;
  orderId: string;
  amount: number;
  currency: string;
  description?: string;
  tokenId: string;
  customerCode?: string;

  constructor(
    orderId: string,
    amount: number,
    currency: string,
    tokenId: string) {
    super();
    this.orderId = orderId;
    this.amount = amount;
    this.currency = currency;
    this.tokenId = tokenId;
  }
}
