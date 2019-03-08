import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AccountService } from './account/account.service';

@Injectable({
  providedIn: 'root'
})
export class AppNotLoggedIn implements CanActivate {

  constructor(
    private readonly accountService: AccountService,
    private readonly router: Router) {
  }

  canActivate(): Observable<boolean> {
    return this.accountService.user$.pipe(map(user => {
      if (user == null || user.expired) {
        return true;
      } else {
        this.router.navigate(['/home']);
        return false;
      }
    }));
  }
}
