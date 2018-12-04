import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from 'oidc-client';
import { AccountService } from './account/account.service';

@Injectable()
export class AppLoggedIn implements CanActivate {

  constructor(private readonly accountService: AccountService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.accountService.user.pipe(map((user: User) => {
      if (user != null && !user.expired) {
        return true;
      } else {
        window.sessionStorage.setItem('returnUrl', state.url);
        this.accountService.signinRedirect();
        return false;
      }
    }));
  }
}
