import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { Observable } from 'rxjs/index';
import { map } from 'rxjs/operators/index';
import { Account } from './account/account';
import { AccountService } from './account/account.service';

@Injectable()
export class AppLoggedIn implements CanActivate {

  constructor(
    private readonly router: Router,
    private readonly accountService: AccountService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.accountService.account.pipe(map((response: Account) => {
      if (response != null) {
        return response.expiration > new Date();
      } else {
        this.router.navigate(['/Account/Login'], {
          queryParams: {
            returnUrl: state.url
          }
        });
        return false;
      }
    }));
  }
}
