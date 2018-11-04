import { HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs/index';
import { environment } from '../environments/environment';

export abstract class AppService {

  protected constructor(protected readonly router: Router) {
  }

  protected handleError(response: HttpErrorResponse): Observable<never> {
    const errors = new Array<string>();
    if (response.status < 500 && response.error && response.error.errors) {
      response.error.errors.forEach(error => {
        if (error.description) {
          errors.push(error.description);
        }
        switch (response.status) {
          case 401:
            this.router.navigate([`/Account/Login`]);
            break;
        }
      });
    } else {
      errors.push('Something bad happened; please try again later.');
    }
    return throwError(errors);
  }

  protected get headers(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      //'Authorization': `Bearer ${this.token}`
    });
  }

  protected get baseUrl(): string {
    return environment.apiUrl;
  }
}
