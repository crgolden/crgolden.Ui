import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RangedModelController } from '@crgolden/core-controllers';
import { environment } from '../../environments/environment';
import { CartProduct } from './cart-product';

@Injectable({
  providedIn: 'root'
})
export class CartProductsController extends RangedModelController<CartProduct> {

  constructor(http: HttpClient) {
    super('cart-products', environment.apiUrl, http);
    this.sortable = { allowUnsort: true, mode: 'multiple' };
    this.state.sort = [{ dir: 'asc', field: 'product.name' }];
  }
}
