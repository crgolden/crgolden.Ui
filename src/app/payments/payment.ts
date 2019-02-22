import { Entity } from '@clarity/entities';

export class Payment extends Entity {
  id: string;
  userId: string;
  chargeId?: string;
  orderId: string;
  amount: number;
  currency: string;
  description?: string;
  tokenId: string;
  customerCode?: string;
}
