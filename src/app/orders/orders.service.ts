import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Order } from './order';
import { BaseModelService } from '../base/base-model.service';

@Injectable()
export class OrdersService extends BaseModelService<Order> {

  constructor(protected readonly http: HttpClient) {
    super('Orders', http);
  }
}
