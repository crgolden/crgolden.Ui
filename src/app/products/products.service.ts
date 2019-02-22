import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Service } from '@clarity/services';
import { environment } from '../../environments/environment';
import { Product } from './product';

@Injectable()
export class ProductsService extends Service<Product, string> {

  constructor(protected readonly http: HttpClient) {
    super('products', environment.apiUrl, http);
  }
}
