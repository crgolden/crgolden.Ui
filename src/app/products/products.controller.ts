import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ModelController } from '@crgolden/core-controllers';
import { environment } from '../../environments/environment';
import { Product } from './product';

@Injectable({
  providedIn: 'root'
})
export class ProductsController extends ModelController<Product> {

  isList: boolean;

  constructor(http: HttpClient) {
    super('products', environment.apiUrl, http);
    this.state.sort = [{
      field: 'name',
      dir: 'asc'
    }];
    this.state.take = 5;
    this.isList = false;
  }
}
