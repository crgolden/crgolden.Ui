import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Event, NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { switchMap, filter } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';
import { BaseModelService } from '../base/base-model.service';
import { Cart } from './cart';
import { CartProduct } from '../cart-products/cart-product';

@Injectable()
export class CartService extends BaseModelService<Cart> {

  cart$: BehaviorSubject<Cart>;

  constructor(
    protected readonly http: HttpClient,
    router: Router,
    cookieService: CookieService) {
    super('Carts', http);
    this.cart$ = new BehaviorSubject<Cart>(undefined);
    combineLatest(router.events, this.cart$).pipe(
      filter((latest: [Event, Cart]) => {
        const [event, cart] = latest;
        return event instanceof NavigationEnd &&
          !event.url.includes('/Account/Login') &&
          !event.url.includes('/Account/Logout') &&
          cart == null;
      }),
      switchMap(() => {
        const cartId = cookieService.get('CartId');
        return cartId.length > 0
          ? this.details$(cartId)
          : this.create$({
            id: undefined,
            name: 'Cart',
            created: undefined,
            total: 0,
            cartProducts: new Array<CartProduct>()
          } as Cart);
      })).subscribe((cart: Cart) => this.cart$.next(cart));
  }
}