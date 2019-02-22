import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Service } from '@clarity/services';
import { environment } from '../../environments/environment';
import { ProductFile } from './product-file';

@Injectable()
export class ProductFilesService extends Service<ProductFile, string> {

  constructor(protected readonly http: HttpClient) {
    super('product-files', environment.apiUrl, http);
  }
}
