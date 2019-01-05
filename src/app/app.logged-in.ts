import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from 'oidc-client';
import { AccountService } from './account/account.service';

@Injectable()
export class AppLoggedIn implements CanActivate {

  constructor(
    private readonly router: Router,
    private readonly accountService: AccountService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.accountService.user$.pipe(map(
      (user: User) => {
        if (user != null && !user.expired) {
          return true;
        } else {
          this.router.navigate(['/account/login'], {
            queryParams: {
              returnUrl: state.url
            }
          });
          return false;
        }
      }));
  }
}
