import { Entity } from '@clarity/entities';

export class CartProduct extends Entity {
  quantity: number;
  price: number;
  extendedPrice: number;
  isDownload: boolean;
  thumbnailUri?: string;
  cartId: string;
  productId: string;
  productName: string;
}
