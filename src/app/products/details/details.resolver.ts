import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { combineLatest, Observable } from 'rxjs';
import { skipWhile, take } from 'rxjs/operators';
import { CartsService } from '../../carts/carts.service';
import { CartProductsService } from '../../cart-products/cart-products.service';
import { ProductsService } from '../products.service';
import { Cart } from '../../carts/cart';
import { Product } from '../product';
import { CartProduct } from '../../cart-products/cart-product';

@Injectable({
  providedIn: 'root'
})
export class DetailsResolver implements Resolve<[
  Cart,
  CartProduct[],
  Product
]> {

  constructor(
    private readonly cartsService: CartsService,
    private readonly cartProductsService: CartProductsService,
    private readonly productsService: ProductsService) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<[
    Cart,
    CartProduct[],
    Product
  ]> {
    const productId = route.paramMap.get('productId');
    if (productId == null) {
      return undefined;
    }

    return combineLatest(
      this.cartsService.cart$
        .pipe(skipWhile(cart => cart == null)),
      this.cartProductsService.cartProducts$
        .pipe((skipWhile(cartProducts => cartProducts == null))),
      this.productsService.details$([productId]))
      .pipe(take(1));
  }
}
