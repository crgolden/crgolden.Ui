import { Model } from '@crgolden/core-models';

export class Product extends Model {
  id?: string;
  active: boolean;
  description?: string;
  isDownload: boolean;
  name: string;
  quantityPerUnit: string;
  reorderLevel?: number;
  sku?: string;
  imageUri?: string;
  imageThumbnailUri?: string;
  unitsInStock?: number;
  unitPrice: number;
  unitsOnOrder?: number;

  constructor(
    active?: boolean,
    isDownload?: boolean,
    unitPrice?: number) {
    super();
    this.active = active || true;
    this.isDownload = isDownload || false;
    this.unitPrice = unitPrice || 0;
  }
}
