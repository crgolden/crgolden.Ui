import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RangedModelController } from '@clarity/core-controllers';
import { environment } from '../../environments/environment';
import { ProductFile } from './product-file';

@Injectable({
  providedIn: 'root'
})
export class ProductFilesController extends RangedModelController<ProductFile> {

  constructor(http: HttpClient) {
    super('product-files', environment.apiUrl, http);
  }
}
