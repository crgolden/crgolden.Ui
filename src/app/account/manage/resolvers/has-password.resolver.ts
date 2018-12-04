import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { ManageService } from '../manage.service';

@Injectable()
export class HasPasswordResolver implements Resolve<boolean> {

  constructor(private readonly manageService: ManageService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.manageService.hasPassword().pipe(
      take(1),
      map((hasPassword: boolean) => hasPassword));
  }
}
