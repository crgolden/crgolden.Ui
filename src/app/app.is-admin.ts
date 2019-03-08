import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AccountService } from './account/account.service';

@Injectable({
  providedIn: 'root'
})
export class AppIsAdmin implements CanActivate {

  constructor(
    private readonly router: Router,
    private readonly accountService: AccountService) {
  }

  canActivate(): Observable<boolean> {
    return this.accountService.userHasRole$('Admin').pipe(map(
      isAdmin => {
        if (isAdmin) {
          return true;
        }
        this.router.navigate(['/access-denied']);
        return false;
      }));
  }
}
