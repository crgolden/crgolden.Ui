import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, of, ObservableInput } from 'rxjs';
import { map, mergeMap, take } from 'rxjs/operators';
import { User } from 'oidc-client';
import { CookieService } from 'ngx-cookie-service';
import { BaseModelService } from '../base/base-model.service';
import { AccountService } from '../account/account.service';
import { Cart } from './cart';

@Injectable()
export class CartService extends BaseModelService<Cart> {

  cart: BehaviorSubject<Cart>;

  constructor(
    protected readonly http: HttpClient,
    private readonly cookieService: CookieService,
    private readonly accountService: AccountService) {
    super('Carts', http);
    this.setCart();
    this.accountService.user.pipe(
      take(1),
      mergeMap((user: User) => this.updateCart(user))).subscribe();
  }

  private setCart(): void {
    this.cart = new BehaviorSubject<Cart>(undefined);
    const cartId = this.cookieService.get('CartId');
    if (cartId != null && cartId.length > 0) {
      this.details(cartId).pipe(
        take(1),
        map((cart: Cart) => this.cart.next(cart))).subscribe();
    }
  }

  private updateCart(user: User): ObservableInput<void> {
    if (user == null || typeof user.profile['sub'] !== 'string') {
      return of();
    }
    return this.cart.pipe(
      take(1),
      mergeMap((cart: Cart) => {
        if (cart == null || cart.userId != null) {
          return of();
        }
        cart.userId = user.profile['sub'];
        return this.edit(cart).pipe(
          take(1),
          map(() => this.cart.next(cart)));
      }));
  }
}
