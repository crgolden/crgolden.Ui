import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpEvent,
  HttpHeaders,
  HttpResponse,
  HttpErrorResponse,
  HttpRequest,
  HttpHandler
} from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs/index';
import { map, catchError } from 'rxjs/operators/index';

@Injectable()
export class AppInterceptor implements HttpInterceptor {

  constructor(protected readonly router: Router) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const request = req.clone({
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      withCredentials: true
    });
    return next
      .handle(request)
      .pipe(
        map((event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
          }
          return event;
        }),
        catchError<HttpEvent<any>, never>(this.handleError));
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
