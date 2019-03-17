import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { combineLatest, Observable } from 'rxjs';
import { skipWhile, take } from 'rxjs/operators';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { CartService } from '../../cart/cart.service';
import { CartProductsService } from '../../cart-products/cart-products.service';
import { ProductsController } from '../products.controller';
import { Cart } from '../../carts/cart';
import { CartProduct } from '../../cart-products/cart-product';

@Injectable({
  providedIn: 'root'
})
export class IndexResolver implements Resolve<[
  Cart,
  CartProduct[],
  GridDataResult
]> {

  constructor(
    private readonly cartService: CartService,
    private readonly cartProductsService: CartProductsService,
    private readonly productsController: ProductsController) {
  }

  resolve(): Observable<[
    Cart,
    CartProduct[],
    GridDataResult
  ]> {
    return combineLatest(
      this.cartService.cart$
        .pipe(skipWhile(cart => cart == null)),
      this.cartProductsService.cartProducts$
        .pipe(skipWhile(cartProducts => cartProducts == null)),
      this.productsController.list$())
      .pipe(take(1));
  }
}
