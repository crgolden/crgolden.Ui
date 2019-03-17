import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { combineLatest, Observable } from 'rxjs';
import { skipWhile, take } from 'rxjs/operators';
import { CartService } from '../../cart/cart.service';
import { CartProductsService } from '../../cart-products/cart-products.service';
import { ProductsController } from '../products.controller';
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
    private readonly cartService: CartService,
    private readonly cartProductsService: CartProductsService,
    private readonly productsController: ProductsController) {
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
      this.cartService.cart$
        .pipe(skipWhile(cart => cart == null)),
      this.cartProductsService.cartProducts$
        .pipe((skipWhile(cartProducts => cartProducts == null))),
      this.productsController.read$([productId]))
      .pipe(take(1));
  }
}
