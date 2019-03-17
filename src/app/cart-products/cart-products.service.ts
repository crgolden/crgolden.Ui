import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CartProductsController } from './cart-products.controller';
import { CartProduct } from './cart-product';

@Injectable({
  providedIn: 'root'
})
export class CartProductsService {

  cartProducts$: BehaviorSubject<CartProduct[]>;

  constructor(private readonly cartProductsController: CartProductsController) {
    this.cartProducts$ = new BehaviorSubject<CartProduct[]>(undefined);
  }

  setCartProducts(cartId?: string): void {
    if (cartId == null) {
      this.cartProducts$.next([]);
      this.cartProductsController.state.filter = undefined;
      this.cartProductsController.state.take = undefined;
      this.cartProductsController.state.skip = undefined;
    } else {
      this.cartProductsController.state.filter = {
        logic: 'and',
        filters: [{ operator: 'eq', field: 'cartId', value: cartId }]
      };
      this.cartProductsController.list$().subscribe(cartProducts => {
        this.cartProductsController.state.take = 5;
        this.cartProductsController.state.skip = 0;
        this.cartProducts$.next(cartProducts.data);
      });
    }
  }
}
