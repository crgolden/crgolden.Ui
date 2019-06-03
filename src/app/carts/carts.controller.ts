import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ModelController } from '@crgolden/core-controllers';
import { environment } from '../../environments/environment';
import { Cart } from './cart';

@Injectable({
  providedIn: 'root'
})
export class CartsController extends ModelController<Cart> {

  constructor(http: HttpClient) {
    super('carts', environment.apiUrl, http);
  }
}
