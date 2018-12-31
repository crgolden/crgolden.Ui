import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AccountService } from './account/account.service';

@Injectable()
export class AppIsAdmin implements CanActivate {

  constructor(
    private readonly router: Router,
    private readonly accountService: AccountService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.accountService.userHasRole$('Admin').pipe(map((response: boolean) => {
      if (response) {
        return true;
      }
      this.router.navigate(['/AccessDenied']);
      return false;
    }));
  }
}
