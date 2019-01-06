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

@Injectable()
export class HasPasswordResolver implements Resolve<boolean> {

  constructor(
    private readonly http: HttpClient,
    private readonly manageService: ManageService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.manageService.hasPassword.pipe(
      concatMap(
        (hasPassword: boolean) => hasPassword == null
          ? this.http.get<boolean>(`${environment.identityUrl}/manage/has-password`).pipe(map(
            (response: boolean) => {
              this.manageService.hasPassword.next(response);
              return response;
            }))
          : of(hasPassword)),
      take(1));
  }
}
