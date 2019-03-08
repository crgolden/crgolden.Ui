import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Service } from '@clarity/services';
import { environment } from '../../environments/environment';
import { ProductFile } from './product-file';

@Injectable({
  providedIn: 'root'
})
export class ProductFilesService extends Service<ProductFile> {

  constructor(http: HttpClient) {
    super('product-files', environment.apiUrl, http);
  }
}
