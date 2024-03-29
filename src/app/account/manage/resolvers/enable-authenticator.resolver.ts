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
import { EnableAuthenticator } from '@crgolden/oidc-models';
import { ManageService } from '../manage.service';

@Injectable()
export class EnableAuthenticatorResolver implements Resolve<EnableAuthenticator> {

  constructor(
    private readonly http: HttpClient,
    private readonly manageService: ManageService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<EnableAuthenticator> {
    return this.manageService.enableAuthenticator.pipe(
      concatMap(
        (enableAuthenticator: EnableAuthenticator) => enableAuthenticator == null
          ? this.http.get<EnableAuthenticator>(`${environment.identityUrl}/manage/enable-authenticator`).pipe(map(
            (response: EnableAuthenticator) => {
              this.manageService.enableAuthenticator.next(response);
              return response;
            }))
          : of(enableAuthenticator)),
      take(1));
  }
}
