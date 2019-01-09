import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { concatMap, take } from 'rxjs/operators';
import { User } from 'oidc-client';
import { AccountService } from '../account/account.service';
import { AddressService } from './address.service';
import { Address } from './address';

@Injectable()
export class AddressResolver implements Resolve<boolean> {

  constructor(
    private readonly accountService: AccountService,
    private readonly addressService: AddressService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.accountService.user$.pipe(concatMap(
      (user: User) => {
        if (user == null || typeof user.profile['address'] !== 'string') {
          return of(false);
        }
        const address = JSON.parse(user.profile['address']) as Address;
        return this.addressService.validate(address);
      }),
      take(1));
  }
}
