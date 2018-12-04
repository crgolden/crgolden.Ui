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
import { map, mergeMap, catchError } from 'rxjs/operators';
import { User } from 'oidc-client';
import { AccountService } from './account/account.service'

@Injectable()
export class AppInterceptor implements HttpInterceptor {

  constructor(
    protected readonly accountService: AccountService,
    protected readonly router: Router) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.accountService.user.pipe(mergeMap((user: User) => {
      req = req.clone({
        setHeaders: {
          'Authorization': user != null ? `${user.token_type} ${user.access_token}` : '',
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });
      return next
        .handle(req)
        .pipe(
          map((event: HttpEvent<any>) => {
            if (event instanceof HttpResponse) {
            }
            return event;
          }),
          catchError<HttpEvent<any>, never>(this.handleError));
    }));
  }

  private handleError(response: HttpErrorResponse): Observable<never> {
    const errors = new Array<string>();
    if (response.status < 500 && response.error) {
      if (typeof response.error === 'string') {
        errors.push(response.error);
      } else if (response.error.errors) {
        response.error.errors.forEach(error => {
          if (error.description) {
            errors.push(error.description);
          }
          switch (response.status) {
            case 401:
              this.router.navigate(['/Account/Login'], {
                queryParams: {
                  returnUrl: this.router.routerState.snapshot.url
                }
              });
              break;
          }
        });
      } else {
        errors.push('Something bad happened; please try again later.');
      }
    }
    return throwError(errors);
  }
}