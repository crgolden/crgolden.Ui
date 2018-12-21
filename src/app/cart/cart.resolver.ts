import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';
import { CartService } from './cart.service';
import { Cart } from './cart';

@Injectable()
export class CartResolver implements Resolve<Cart> {

  constructor(
    private readonly cookieService: CookieService,
    private readonly cartService: CartService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Cart> {
    const cartId = this.cookieService.get('CartId');
    if (cartId != null && cartId.length > 0) {
      return this.cartService.details(cartId).pipe(
        take(1),
        map((cart: Cart) => cart));
    }
    return of(undefined);
  }
}
