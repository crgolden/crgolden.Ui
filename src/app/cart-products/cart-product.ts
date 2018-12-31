import { BaseRelationship } from '../base/base-relationship';

export class CartProduct extends BaseRelationship {
  quantity: number;
  price: number;
  extendedPrice: number;
  isDownload: boolean;
}
