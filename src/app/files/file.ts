import { Entity } from '@clarity/entities';
import { ProductFile } from '../product-files/product-file';

export class File extends Entity {
  id: string;
  uri: string;
  name: string;
  fileName: string;
  contentType: string;
  productFiles: Array<ProductFile>;
}
