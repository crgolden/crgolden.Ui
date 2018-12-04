import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { ManageService } from '../manage.service';
import { ExternalLogins } from '../models/external-logins';

@Injectable()
export class ExternalLoginsResolver implements Resolve<ExternalLogins> {

  constructor(private readonly manageService: ManageService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ExternalLogins> {
    return this.manageService.externalLogins().pipe(
      take(1),
      map((externalLogins: ExternalLogins) => externalLogins));
  }
}
