import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../environments/environment';
import { ActionType } from '../app.action-type';
import { CartsController } from '../carts/carts.controller';
import { CartProductsService } from '../cart-products/cart-products.service';
import { Cart } from '../carts/cart';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cart$: BehaviorSubject<Cart>;

  constructor(
    private readonly router: Router,
    private readonly cookieService: CookieService,
    private readonly cartsController: CartsController,
    private readonly cartProductsService: CartProductsService) {
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
          ? this.cartsController.read$([cartId]).subscribe(cart => cartContinue(cart))
          : this.cartsController.create$({}).subscribe(cart => cartContinue(cart));
        break;
      case ActionType.Login:
        const loginContinue = (cart: Cart) => this.router.navigate(['/']).then(() => {
          cartContinue(cart);
          this.router.navigate([returnUrl || '/home'])
            .then(() => window.sessionStorage.removeItem('returnUrl'));
        });
        cartId.length > 0
          ? this.cartsController.read$([cartId]).subscribe(cart => loginContinue(cart))
          : this.cartsController.create$({}).subscribe(cart => loginContinue(cart));
        break;
      case ActionType.Logout:
        this.cookieService.delete('CartId', '/', `${environment.cookieDomain}`);
        this.cartsController.create$({}).subscribe((cart) => cartContinue(cart));
        break;
    }
  }
}
