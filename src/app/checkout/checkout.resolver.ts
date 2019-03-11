import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { combineLatest, Observable, of } from 'rxjs';
import { concatMap, skipWhile, take } from 'rxjs/operators';
import { User } from 'oidc-client';
import { AccountService } from '../account/account.service';
import { CartProductsService } from '../cart-products/cart-products.service';
import { AddressService } from '../address/address.service';
import { CartProduct } from '../cart-products/cart-product';
import { Address } from '../address/address';

@Injectable({
  providedIn: 'root'
})
export class CheckoutResolver implements Resolve<[
  Address,
  CartProduct[],
  boolean,
  User
]> {

  constructor(
    private readonly accountService: AccountService,
    private readonly cartProductsService: CartProductsService,
    private readonly addressService: AddressService) {
  }

  resolve(): Observable<[
    Address,
    CartProduct[],
    boolean,
    User
  ]> {
    return this.accountService.user$.pipe(
      skipWhile(user => user == null),
      concatMap((user: User) => {
        const address = user.profile['address'];
        return combineLatest(
          of(address || new Address()),
          this.cartProductsService.cartProducts$
            .pipe(skipWhile(cartProducts => cartProducts == null)),
          address != null
            ? this.addressService.validate(JSON.parse(address) as Address)
            : of(false),
          of(user));
      }),
      take(1));
  }
}
