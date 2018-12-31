import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, mergeMap, switchMap, take } from 'rxjs/operators';
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
    return this.cartService.cart$.
      pipe(
        take(1),
        mergeMap((cart: Cart) => {
          if (cart == null) {
            return of(false);
          }
          if (!cart.cartProducts.some(x => !x.isDownload)) {
            return of(true);
          }
          return this.accountService.user$
            .pipe(
              take(1),
              switchMap((user: User) => {
                if (user == null || typeof user.profile['address'] !== 'string') {
                  return of(false);
                }
                const address = JSON.parse(user.profile['address']) as Address;
                return this.addressService.validate(address)
                  .pipe(
                    take(1),
                    map((isValid: boolean) => isValid));
              }));
        }));
  }
}
