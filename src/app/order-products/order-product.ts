import { Entity } from '@clarity/entities';

export class OrderProduct extends Entity {
  quantity: number;
  price: number;
  extendedPrice: number;
  isDownload: boolean;
  thumbnailUri?: string;
  orderId: string;
  productId: string;
  productName: string;
}
