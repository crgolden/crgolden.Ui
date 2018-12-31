import { BaseRelationship } from '../base/base-relationship';

export class OrderProduct extends BaseRelationship {
  quantity: number;
  price: number;
  extendedPrice: number;
  isDownload: boolean;
}
