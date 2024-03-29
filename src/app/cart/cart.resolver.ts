import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { combineLatest, Observable, of } from 'rxjs';
import { concatMap, skipWhile, take } from 'rxjs/operators';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { CartProductsController } from '../cart-products/cart-products.controller';
import { CartProductsService } from '../cart-products/cart-products.service';
import { CartProduct } from '../cart-products/cart-product';

@Injectable({
  providedIn: 'root'
})
export class CartResolver implements Resolve<[
  CartProduct[],
  GridDataResult
]> {

  constructor(
    private readonly cartProductsController: CartProductsController,
    private readonly cartProductsService: CartProductsService) {
  }

  resolve(): Observable<[
    CartProduct[],
    GridDataResult
  ]> {
    return this.cartProductsService.cartProducts$
      .pipe(skipWhile(cartProducts => cartProducts == null))
      .pipe((concatMap(cartProducts => combineLatest(
        of(cartProducts),
        this.cartProductsController.list$()
      )))).pipe(take(1));
  }
}
