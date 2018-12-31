import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { concatMap, map, take } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { ManageService } from '../manage.service';
import { EnableAuthenticator } from '../models/enable-authenticator';

@Injectable()
export class EnableAuthenticatorResolver implements Resolve<EnableAuthenticator> {

  constructor(
    private readonly http: HttpClient,
    private readonly manageService: ManageService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<EnableAuthenticator> {
    return this.manageService.enableAuthenticator.pipe(
      take(1),
      concatMap((enableAuthenticator: EnableAuthenticator) => {
        if (typeof enableAuthenticator === 'undefined') {
          return this.http
            .get<EnableAuthenticator>(`${environment.identityUrl}/Manage/EnableAuthenticator`)
            .pipe(
              take(1),
              map((value: EnableAuthenticator) => {
                this.manageService.enableAuthenticator.next(value);
                return value;
              }));
        } else {
          return of(enableAuthenticator);
        }
      }));
  }
}
