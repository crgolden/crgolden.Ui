import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { Observable } from 'rxjs/index';
import { map } from 'rxjs/operators/index';
import { Account } from './account';
import { AccountService } from './account.service';

@Injectable()
export class AccountNotLoggedIn implements CanActivate {

  constructor(private readonly accountService: AccountService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.accountService.account.pipe(map((response: Account) => {
      if (response != null) {
        return response.expiration <= new Date();
      } else {
        return true;
      }
    }));
  }
}
