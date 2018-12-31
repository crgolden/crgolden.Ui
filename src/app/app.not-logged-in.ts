import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from 'oidc-client';
import { AccountService } from './account/account.service';

@Injectable()
export class AppNotLoggedIn implements CanActivate {

  constructor(
    private readonly accountService: AccountService,
    private readonly router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.accountService.user$
      .pipe(map((user: User) => {
        if (user == null || user.expired) {
          return true;
        } else {
          this.router.navigate(['/Home']);
          return false;
        }
      }));
  }
}
