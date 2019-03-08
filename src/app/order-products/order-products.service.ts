import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Service } from '@clarity/services';
import { environment } from '../../environments/environment';
import { OrderProduct } from './order-product';

@Injectable({
  providedIn: 'root'
})
export class OrderProductsService extends Service<OrderProduct> {

  constructor(http: HttpClient) {
    super('order-products', environment.apiUrl, http);
  }
}
