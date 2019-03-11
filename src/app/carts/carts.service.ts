import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Service } from '@clarity/services';
import { BehaviorSubject } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../environments/environment';
import { ActionType } from '../app.action-type';
import { CartProductsService } from '../cart-products/cart-products.service';
import { Cart } from './cart';

@Injectable({
  providedIn: 'root'
})
export class CartsService extends Service<Cart> {

  cart$: BehaviorSubject<Cart>;

  constructor(
    private readonly router: Router,
    private readonly cookieService: CookieService,
    private readonly cartProductsService: CartProductsService,
    http: HttpClient) {
    super('carts', environment.apiUrl, http);
    this.cart$ = new BehaviorSubject<Cart>(undefined as Cart);
  }

  setCart(type: ActionType, returnUrl?: string): void {
    const cartId = this.cookieService.get('CartId');
    const cartContinue = (cart: Cart) => {
      this.cookieService.set('CartId', cart.id, null, '/', `${environment.cookieDomain}`);
      this.cart$.next(cart);
      this.cartProductsService.setCartProducts(cart.id);
    };
    switch (type) {
      case ActionType.Load:
        cartId.length > 0
          ? this.details$([cartId]).subscribe(cart => cartContinue(cart))
          : this.create$({}).subscribe(cart => cartContinue(cart));
        break;
      case ActionType.Login:
        const loginContinue = (cart: Cart) => {
          cartContinue(cart);
          this.router.navigate([returnUrl || '/home']).then(navigated => {
            if (navigated) {
              window.sessionStorage.removeItem('returnUrl');
            }
          });
        };
        cartId.length > 0
          ? this.details$([cartId]).subscribe(cart => loginContinue(cart))
          : this.create$({}).subscribe(cart => loginContinue(cart));
        break;
      case ActionType.Logout:
        this.cookieService.delete('CartId', '/', `${environment.cookieDomain}`);
        this.cartProductsService.cartProducts$.next(null);
        break;
    }
  }
}
