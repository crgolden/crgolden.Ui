import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';
import { Cart } from '../cart/cart';
import { CartService } from '../cart/cart.service';

@Injectable()
export class CheckoutCanActivate implements CanActivate {

  private readonly cartId: string;

  constructor(
    private readonly router: Router,
    private readonly cartService: CartService,
    cookieService: CookieService) {
    this.cartId = cookieService.get('CartId');
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    if (this.cartId.length === 0) {
      this.router.navigate(['/Cart']);
      return of(false);
    }
    return this.cartService.details$(this.cartId)
      .pipe(map((cart: Cart) => {
        if (cart != null && cart.cartProducts != null && cart.cartProducts.length > 0) {
          return true;
        }
        this.router.navigate(['/Cart']);
        return false;
      }));
  }
}
