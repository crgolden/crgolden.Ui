import { BaseModel } from '../base/base-model';

export class Payment extends BaseModel {
  userId: string;
  chargeId?: string;
  orderId?: string;
  amount: number;
  currency: string;
  description?: string;
  tokenId: string;
  authorizationCode?: string;
}
