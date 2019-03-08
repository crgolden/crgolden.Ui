import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Service } from '@clarity/services';
import { environment } from '../../environments/environment';
import { Product } from './product';

@Injectable({
  providedIn: 'root'
})
export class ProductsService extends Service<Product> {

  isList: boolean;

  constructor(protected readonly http: HttpClient) {
    super('products', environment.apiUrl, http);
    this.state.sort = [{
      field: 'name',
      dir: 'asc'
    }];
    this.state.take = 5;
    this.isList = false;
  }
}
