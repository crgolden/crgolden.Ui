import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { Observable } from 'rxjs/index';
import { map } from 'rxjs/operators/index';
import { Account } from './account';
import { AccountService } from './account.service';

@Injectable()
export class AccountLoggedIn implements CanActivate {

  constructor(
    private readonly router: Router,
    private readonly accountService: AccountService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.accountService.account.pipe(map((response: Account) => {
      if (response != null && state.url.includes(response.id)) {
        return true;
      } else {
        this.router.navigate(['/Home']);
        return false;
      }
    }));
  }
}
