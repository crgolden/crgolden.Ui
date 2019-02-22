import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Service } from '@clarity/services';
import { environment } from '../../environments/environment';
import { Order } from './order';

@Injectable()
export class OrdersService extends Service<Order, string> {

  constructor(protected readonly http: HttpClient) {
    super('orders', environment.apiUrl, http);
  }
}
