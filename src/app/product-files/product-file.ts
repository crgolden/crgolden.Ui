import { BaseRelationship } from '../base/base-relationship';

export class ProductFile extends BaseRelationship {
  uri: string;
  primary: boolean;
  contentType: string;
}
