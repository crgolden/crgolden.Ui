import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ModelController } from '@clarity/core-controllers';
import { environment } from '../../environments/environment';
import { Order } from './order';

@Injectable({
  providedIn: 'root'
})
export class OrdersController extends ModelController<Order> {

  constructor(http: HttpClient) {
    super('orders', environment.apiUrl, http);
    this.state.sort = [{
      field: 'number',
      dir: 'asc'
    }];
    this.state.take = 5;
  }
}
