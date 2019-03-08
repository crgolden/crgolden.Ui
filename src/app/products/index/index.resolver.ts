import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { combineLatest, Observable } from 'rxjs';
import { skipWhile, take } from 'rxjs/operators';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { CartsService } from '../../carts/carts.service';
import { CartProductsService } from '../../cart-products/cart-products.service';
import { ProductsService } from '../products.service';
import { Cart } from '../../carts/cart'
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
    private readonly cartsService: CartsService,
    private readonly cartProductsService: CartProductsService,
    private readonly productsService: ProductsService) {
  }

  resolve(): Observable<[
    Cart,
    CartProduct[],
    GridDataResult
  ]> {
    return combineLatest(
      this.cartsService.cart$
        .pipe(skipWhile(cart => cart == null)),
      this.cartProductsService.cartProducts$
        .pipe(skipWhile(cartProducts => cartProducts == null)),
      this.productsService.index$())
      .pipe(take(1));
  }
}
