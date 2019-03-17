import { Model } from '@clarity/core-models';
import { Product } from '../products/product';
import { Category } from '../categories/category';

export class ProductCategory extends Model {
  productId: string;
  productName: string;
  productIsDownload: boolean;
  productActive: boolean;
  productQuantityPerUnit: string;
  productUnitPrice: number;
  categoryId: string;
  categoryName: string;

  constructor(
    product: Product,
    category: Category) {
    super();
    this.productId = product.id;
    this.productName = product.name;
    this.productIsDownload = product.isDownload;
    this.productActive = product.active;
    this.productQuantityPerUnit = product.quantityPerUnit;
    this.categoryId = category.id;
    this.categoryName = category.name;
  }
}

export function toProduct(productCategory: ProductCategory): Product {
  return {
    id: productCategory.productId,
    name: productCategory.productName,
    isDownload: productCategory.productIsDownload,
    active: productCategory.productActive,
    quantityPerUnit: productCategory.productQuantityPerUnit,
    unitPrice: productCategory.productUnitPrice
  };
}

export function toCategory(productCategory: ProductCategory): Category {
  return {
    id: productCategory.categoryId,
    name: productCategory.categoryName
  };
}
