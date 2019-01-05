import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpEvent,
  HttpResponse,
  HttpErrorResponse,
  HttpRequest,
  HttpHandler,
} from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, map, switchMap, take } from 'rxjs/operators';
import { User } from 'oidc-client';
import { AccountService } from './account/account.service';

@Injectable()
export class AppInterceptor implements HttpInterceptor {

  constructor(
    protected readonly accountService: AccountService,
    protected readonly router: Router) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.accountService.user$.pipe(
      take(1),
      switchMap(
        (user: User) => next.handle(req.clone({
          setHeaders: {
            'Authorization': user != null ? `${user.token_type} ${user.access_token}` : ''
          },
          withCredentials: true
        })).pipe(map(
          (event: HttpEvent<any>) => {
            if (event instanceof HttpResponse) {
              // placeholder for response handling
            }
            return event;
          }))),
      catchError(this.handleError));
  }

  private handleError = (response: HttpErrorResponse): Observable<never> => {
    const errors = new Array<string>();
    if (response.status < 500) {
      switch (response.status) {
        case 401:
          this.router.navigate(['/account/login'], {
            queryParams: {
              returnUrl: this.router.routerState.snapshot.url
            }
          });
          break;
        case 403:
          this.router.navigate(['/access-denied']);
          break;
      }
      if (response.error) {
        if (typeof response.error === 'string') {
          errors.push(response.error);
        } else if (response.error['errors'] instanceof Array) {
          response.error['errors'].forEach((error: any) => {
            if (typeof error['description'] === 'string') {
              errors.push(error['description']);
            }
          });
        } else if (response.error instanceof Array) {
          response.error.forEach((error: any) => {
            if (typeof error['description'] === 'string') {
              errors.push(error['description']);
            }
          });
        }
      }
    } else {
      errors.push('Something bad happened; please try again later.');
    }
    return throwError(errors);
  }
}
