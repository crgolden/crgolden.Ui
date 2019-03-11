import { Model } from '@clarity/models';
import { Order } from '../orders/order';
import { Product } from '../products/product';

export class OrderProduct extends Model {
  quantity: number;
  orderId: string;
  orderNumber: number;
  orderTotal: number;
  productId: string;
  productName: string;
  productActive: boolean;
  productImageThumbnailUri: string;
  productIsDownload: boolean;
  productUnitPrice: number;
  productQuantityPerUnit: string;

  constructor(
    order: Order,
    product: Product,
    quantity: number) {
    super();
    this.quantity = quantity;
    this.orderId = order.id;
    this.orderNumber = order.number;
    this.orderTotal = order.total;
    this.productId = product.id;
    this.productName = product.name;
    this.productActive = product.active;
    this.productImageThumbnailUri = product.imageThumbnailUri;
    this.productIsDownload = product.isDownload;
    this.productUnitPrice = product.unitPrice;
    this.productQuantityPerUnit = product.quantityPerUnit;
  }
}

export function toOrder(orderProduct: OrderProduct): Order {
  return {
    id: orderProduct.orderId,
    number: orderProduct.orderNumber,
    total: orderProduct.orderTotal
  };
}

export function toProduct(orderProduct: OrderProduct): Product {
  return {
    id: orderProduct.productId,
    name: orderProduct.productName,
    isDownload: orderProduct.productIsDownload,
    active: orderProduct.productActive,
    quantityPerUnit: orderProduct.productQuantityPerUnit,
    unitPrice: orderProduct.productUnitPrice,
    imageThumbnailUri: orderProduct.productImageThumbnailUri
  };
}
