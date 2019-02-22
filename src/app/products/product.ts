import { Entity } from '@clarity/entities';
import { CartProduct } from '../cart-products/cart-product';
import { OrderProduct } from '../order-products/order-product';
import { ProductFile } from '../product-files/product-file';
import { ProductCategory } from '../product-categories/product-category';

export class Product extends Entity {
  id: string;
  active: boolean;
  description?: string;
  isDownload: boolean;
  name: string;
  quantityPerUnit: string;
  reorderLevel?: number;
  sku?: string;
  unitsInStock?: number;
  unitPrice: number;
  unitsOnOrder?: number;
  cartProducts: Array<CartProduct>;
  orderProducts: Array<OrderProduct>;
  productCategories: Array<ProductCategory>;
  productFiles: Array<ProductFile>;

  static thumbnailUri(productFiles: Array<ProductFile>): string {
    if (!productFiles || productFiles.length === 0) {
      return undefined;
    }
    const primaryImages = productFiles.filter((productFile: ProductFile) =>
      productFile.contentType.includes('image') &&
      !productFile.uri.includes('thumbnails/'));
    let primaryImageFile = primaryImages.find((productFile: ProductFile) => productFile.primary);
    if (primaryImageFile == null && primaryImages.length > 0) {
      primaryImageFile = primaryImages[0];
    }
    if (primaryImageFile == null) {
      return undefined;
    }
    let start = primaryImageFile.uri.lastIndexOf('/') + 1;
    let end = primaryImageFile.uri.indexOf('?');
    const fileName = primaryImageFile.uri.substring(start, end);
    start = 0;
    end = fileName.indexOf('.');
    const id = fileName.substring(start, end);
    const thumbnailImageFile = productFiles.find((productFile: ProductFile) =>
      productFile.uri.includes(id) &&
      productFile.uri.includes('thumbnails/'));
    if (thumbnailImageFile == null) {
      return undefined;
    }
    return thumbnailImageFile.uri;
  }
}
