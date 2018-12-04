import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { ManageService } from '../manage.service';
import { EnableAuthenticator } from '../models/enable-authenticator';

@Injectable()
export class EnableAuthenticatorResolver implements Resolve<EnableAuthenticator> {

  constructor(private readonly manageService: ManageService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<EnableAuthenticator> {
    return this.manageService.enableAuthenticator().pipe(
      take(1),
      map((enableAuthenticator: EnableAuthenticator) => enableAuthenticator));
  }
}
