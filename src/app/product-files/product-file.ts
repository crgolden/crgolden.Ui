import { Model } from '@clarity/models';
import { Product } from '../products/product';
import { File } from '../files/file';

export class ProductFile extends Model {
  isPrimary: boolean;
  productId: string;
  productName: string;
  productActive: boolean;
  productQuantityPerUnit: string;
  productImageThumbnailUri: string;
  productIsDownload: boolean;
  productUnitPrice: number;
  fileId: string;
  fileName: string;
  fileUri: string;
  fileContentType: string;

  constructor(
    product: Product,
    file: File,
    isPrimary: boolean) {
    super();
    this.isPrimary = isPrimary;
    this.productId = product.id;
    this.productName = product.name;
    this.productActive = product.active;
    this.productQuantityPerUnit = product.quantityPerUnit;
    this.productImageThumbnailUri = product.imageThumbnailUri;
    this.productIsDownload = product.isDownload;
    this.productUnitPrice = product.unitPrice;
    this.fileId = file.id;
    this.fileName = file.name;
    this.fileUri = file.uri;
    this.fileContentType = file.contentType;
  }
}

export function toProduct(productFile: ProductFile): Product {
  return {
    id: productFile.productId,
    name: productFile.productName,
    isDownload: productFile.productIsDownload,
    active: productFile.productActive,
    quantityPerUnit: productFile.productQuantityPerUnit,
    unitPrice: productFile.productUnitPrice
  }
}

export function toFile(productFile: ProductFile): File {
  return {
    id: productFile.fileId,
    uri: productFile.fileUri,
    name: productFile.fileName,
    contentType: productFile.fileContentType
  }
}
