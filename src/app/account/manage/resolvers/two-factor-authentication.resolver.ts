import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { ManageService } from '../manage.service';
import { TwoFactorAuthentication } from '../models/two-factor-authentication';

@Injectable()
export class TwoFactorAuthenticationResolver implements Resolve<TwoFactorAuthentication> {

  constructor(private readonly manageService: ManageService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<TwoFactorAuthentication> {
    return this.manageService.twoFactorAuthentication().pipe(
      take(1),
      map((twoFactorAuthentication: TwoFactorAuthentication) => twoFactorAuthentication));
  }
}
