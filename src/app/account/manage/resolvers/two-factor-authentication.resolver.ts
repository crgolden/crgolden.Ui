import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { concatMap, map, take } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { ManageService } from '../manage.service';
import { TwoFactorAuthentication } from '../models/two-factor-authentication';

@Injectable()
export class TwoFactorAuthenticationResolver implements Resolve<TwoFactorAuthentication> {

  constructor(
    private readonly http: HttpClient,
    private readonly manageService: ManageService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<TwoFactorAuthentication> {
    return this.manageService.twoFactorAuthentication.pipe(
      concatMap(
        (twoFactorAuthentication: TwoFactorAuthentication) => twoFactorAuthentication == null
          ? this.http.get<TwoFactorAuthentication>(`${environment.identityUrl}/Manage/TwoFactorAuthentication`).pipe(map(
            (response: TwoFactorAuthentication) => {
              this.manageService.twoFactorAuthentication.next(response);
              return response;
            }))
          : of(twoFactorAuthentication)),
      take(1));
  }
}
