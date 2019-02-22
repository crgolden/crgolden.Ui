import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Service } from '@clarity/services';
import { environment } from '../../environments/environment';
import { CartProduct } from './cart-product';

@Injectable()
export class CartProductsService extends Service<CartProduct, string> {

  constructor(protected readonly http: HttpClient) {
    super('cart-products', environment.apiUrl, http);
  }
}
