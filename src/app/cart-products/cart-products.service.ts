import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Service } from '@clarity/services';
import { environment } from '../../environments/environment';
import { CartProduct } from './cart-product';

@Injectable({
  providedIn: 'root'
})
export class CartProductsService extends Service<CartProduct> {

  cartProducts$: BehaviorSubject<CartProduct[]>;

  constructor(http: HttpClient) {
    super('cart-products', environment.apiUrl, http);
    this.cartProducts$ = new BehaviorSubject<CartProduct[]>(undefined);
    this.sortable = { allowUnsort: true, mode: 'multiple' };
    this.state.sort = [{ dir: 'asc', field: 'product.name' }];
  }

  setCartProducts(cartId?: string): void {
    if (cartId == null) {
      this.cartProducts$.next([]);
      this.state.filter = undefined;
      this.state.take = undefined;
      this.state.skip = undefined;
    } else {
      this.state.filter = {
        logic: 'and',
        filters: [{ operator: 'eq', field: 'cartId', value: cartId }]
      };
      this.index$().subscribe(cartProducts => {
        this.state.take = 5;
        this.state.skip = 0;
        this.cartProducts$.next(cartProducts.data);
      });
    }
  }
}
