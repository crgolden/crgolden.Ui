import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OrderProduct } from './order-product';
import { BaseRelationshipService } from '../base/base-relationship.service';

@Injectable()
export class OrderProductsService extends BaseRelationshipService<OrderProduct> {

  constructor(protected readonly http: HttpClient) {
    super('OrderProducts', http);
  }
}
