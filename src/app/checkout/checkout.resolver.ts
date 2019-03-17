import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { combineLatest, Observable, of } from 'rxjs';
import { concatMap, skipWhile, take } from 'rxjs/operators';
import { User } from 'oidc-client';
import { Address } from '@clarity/core-claims';
import { AccountService } from '../account/account.service';
import { CartProductsService } from '../cart-products/cart-products.service';
import { AddressController } from '../address/address.controller';
import { CartProduct } from '../cart-products/cart-product';

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
    private readonly addressController: AddressController) {
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
        const address = typeof user.profile['address'] === 'string'
          ? JSON.parse(user.profile['address']) as Address
          : undefined;
        return combineLatest(
          of(address || new Address()),
          this.cartProductsService.cartProducts$
            .pipe(skipWhile(cartProducts => cartProducts == null)),
          address != null
            ? this.addressController.validate(address)
            : of(false),
          of(user));
      }),
      take(1));
  }
}
