import { BaseModel } from '../base/base-model';
import { ProductFile } from '../product-files/product-file';

export class File extends BaseModel {
  uri: string;
  contentType: string;
  length: number;
  fileName: string;
  productFiles: Array<ProductFile>;
}
