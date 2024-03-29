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
import { ExternalLogins } from '@crgolden/oidc-models';
import { ManageService } from '../manage.service';

@Injectable()
export class ExternalLoginsResolver implements Resolve<ExternalLogins> {

  constructor(
    private readonly http: HttpClient,
    private readonly manageService: ManageService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ExternalLogins> {
    return this.manageService.externalLogins.pipe(
      concatMap(
        (externalLogins: ExternalLogins) => externalLogins == null
          ? this.http.get<ExternalLogins>(`${environment.identityUrl}/manage/external-logins`).pipe(map(
            (response: ExternalLogins) => {
              this.manageService.externalLogins.next(response);
              return response;
          }))
          : of(externalLogins)),
      take(1));
  }
}
