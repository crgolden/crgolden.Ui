import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ProductFile } from './product-file';
import { BaseRelationshipService } from '../base/base-relationship.service';

@Injectable()
export class ProductFilesService extends BaseRelationshipService<ProductFile> {

  constructor(protected readonly http: HttpClient) {
    super('ProductFiles', http);
  }
}
