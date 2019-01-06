import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from './product';
import { BaseModelService } from '../base/base-model.service';

@Injectable()
export class ProductsService extends BaseModelService<Product> {

  constructor(protected readonly http: HttpClient) {
    super('products', http);
  }
}
