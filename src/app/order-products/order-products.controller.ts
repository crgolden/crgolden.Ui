import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RangedModelController } from '@clarity/core-controllers';
import { environment } from '../../environments/environment';
import { OrderProduct } from './order-product';

@Injectable({
  providedIn: 'root'
})
export class OrderProductsController extends RangedModelController<OrderProduct> {

  constructor(http: HttpClient) {
    super('order-products', environment.apiUrl, http);
  }
}
