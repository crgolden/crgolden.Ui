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
      take(1),
      concatMap((hasPassword: boolean) => {
        if (typeof hasPassword === 'undefined') {
          return this.http
            .get<boolean>(`${environment.identityUrl}/Manage/HasPassword`)
            .pipe(
              take(1),
              map((value: boolean) => {
                this.manageService.hasPassword.next(value);
                return value;
              }));
        } else {
          return of(hasPassword);
        }
      }));
  }
}
