import { Entity } from '@clarity/entities';

export class ProductFile extends Entity {
  name: string;
  uri: string;
  contentType: string;
  primary: boolean;
  productId: string;
  productName: string;
  fileId: string;
  fileName: string;
}
