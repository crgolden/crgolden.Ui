import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { combineLatest, Observable, of } from 'rxjs';
import { concatMap, take } from 'rxjs/operators';
import { User } from 'oidc-client';
import { AccountService } from '../account/account.service';
import { AddressService } from './address.service';
import { Address } from './address';
import { CartService } from '../cart/cart.service';
import { Cart } from '../cart/cart';

@Injectable()
export class AddressResolver implements Resolve<boolean> {

  constructor(
    private readonly accountService: AccountService,
    private readonly addressService: AddressService,
    private readonly cartService: CartService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return combineLatest(
      this.cartService.cart$,
      this.accountService.user$).pipe(
        concatMap(
          (latest: [Cart, User]) => {
            const [cart, user] = latest;
            if (cart == null) {
              return of(false);
            }
            if (!cart.cartProducts.some(x => !x.isDownload)) {
              return of(true);
            }
            if (user == null || typeof user.profile['address'] !== 'string') {
              return of(false);
            }
            const address = JSON.parse(user.profile['address']) as Address;
            return this.addressService.validate(address);
          }),
        take(1));
  }
}
