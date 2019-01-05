import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ManageService } from './manage.service';

@Injectable()
export class ManageTwoFactorEnabled implements CanActivate {

  constructor(
    private readonly router: Router,
    private readonly manageService: ManageService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.manageService.isTwoFactorEnabled$().pipe(map((isTwoFactorEnabled: boolean) => {
      if (isTwoFactorEnabled) {
        return true;
      } else {
        this.router.navigate(['/home']);
        return false;
      }
    }));
  }
}
