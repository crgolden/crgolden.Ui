import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CartProduct } from './cart-product';
import { BaseRelationshipService } from '../base/base-relationship.service';

@Injectable()
export class CartProductsService extends BaseRelationshipService<CartProduct> {

  constructor(protected readonly http: HttpClient) {
    super('cart-products', http);
  }
}
