import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Cart } from '../cart/cart';
import { CartService } from '../cart/cart.service';

@Injectable()
export class CheckoutCanActivate implements CanActivate {

  constructor(
    private readonly router: Router,
    private readonly cartService: CartService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.cartService.cart$
      .pipe(map((cart: Cart) => {
        if (cart != null && cart.cartProducts != null && cart.cartProducts.length > 0) {
          return true;
        }
        this.router.navigate(['/Cart']);
        return false;
      }));
  }
}
