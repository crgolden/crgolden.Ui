import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Service } from '@clarity/services';
import { environment } from '../../environments/environment';
import { Order } from './order';

@Injectable({
  providedIn: 'root'
})
export class OrdersService extends Service<Order> {

  constructor(http: HttpClient) {
    super('orders', environment.apiUrl, http);
    this.state.sort = [{
      field: 'number',
      dir: 'asc'
    }];
    this.state.take = 5;
  }
}
