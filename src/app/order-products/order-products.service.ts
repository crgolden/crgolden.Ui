import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Service } from '@clarity/services';
import { environment } from '../../environments/environment';
import { OrderProduct } from './order-product';

@Injectable()
export class OrderProductsService extends Service<OrderProduct, string> {

  constructor(protected readonly http: HttpClient) {
    super('order-products', environment.apiUrl, http);
  }
}
