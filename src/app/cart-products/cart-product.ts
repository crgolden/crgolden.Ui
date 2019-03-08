import { Model } from '@clarity/models';
import { Cart } from '../carts/cart';
import { Product } from '../products/product';

export class CartProduct extends Model {
  quantity: number;
  cartId: string;
  productId: string;
  productName: string;
  productActive: boolean;
  productQuantityPerUnit: string;
  productImageThumbnailUri: string;
  productIsDownload: boolean;
  productUnitPrice: number;

  constructor(cart: Cart, product: Product, quantity: number) {
    super();
    this.quantity = quantity;
    this.cartId = cart.id;
    this.productId = product.id;
    this.productName = product.name;
    this.productActive = product.active;
    this.productQuantityPerUnit = product.quantityPerUnit;
    this.productImageThumbnailUri = product.imageThumbnailUri;
    this.productIsDownload = product.isDownload;
    this.productUnitPrice = product.unitPrice;
  }
}

export function toCart(cartProduct: CartProduct): Cart {
  return {
    id: cartProduct.cartId
  }
}

export function toProduct(cartProduct: CartProduct): Product {
  return {
    id: cartProduct.productId,
    name: cartProduct.productName,
    isDownload: cartProduct.productIsDownload,
    active: cartProduct.productActive,
    quantityPerUnit: cartProduct.productQuantityPerUnit,
    unitPrice: cartProduct.productUnitPrice,
    imageThumbnailUri: cartProduct.productImageThumbnailUri
  }
}
