import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { ManageService } from '../manage.service';
import { AuthenticationScheme } from '../models/authentication-scheme';

@Injectable()
export class AuthenticationSchemesResolver implements Resolve<Array<AuthenticationScheme>> {

  constructor(private readonly manageService: ManageService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Array<AuthenticationScheme>> {
    return this.manageService.externalAuthenticationSchemes().pipe(
      take(1),
      map((authenticationSchemes: Array<AuthenticationScheme>) => authenticationSchemes));
  }
}
