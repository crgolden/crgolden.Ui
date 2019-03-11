import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, skipWhile, take } from 'rxjs/operators';
import { CartProductsService } from '../cart-products/cart-products.service';

@Injectable({
  providedIn: 'root'
})
export class CheckoutHasCartProducts implements CanActivate {

  constructor(
    private readonly router: Router,
    private readonly cartProductsService: CartProductsService) {
  }

  canActivate(): Observable<boolean> {
    console.log('has-cart-products-starting');
    return this.cartProductsService.cartProducts$.pipe(
      skipWhile(cartProducts => cartProducts == null),
      map(cartProducts => {
        if (cartProducts.length > 0) {
          console.log('has-cart-products-true');
          return true;
        } else {
          console.log('has-cart-products-false');
          this.router.navigate(['/cart']);
          return false;
        }
      }),
      take(1));
  }
}
