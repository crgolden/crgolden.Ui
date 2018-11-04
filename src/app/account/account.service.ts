import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs/index';
import { map, catchError } from 'rxjs/operators/index';
import { AppService } from '../app.service';
import { Login } from './login/login';

@Injectable()
export class AccountService extends AppService {

  returnUrl: string;

  constructor(
    private readonly http: HttpClient,
    private readonly route: ActivatedRoute,
    protected readonly router: Router) {
    super(router);
    route.queryParams.subscribe((params: Params) => this.returnUrl = params['returnUrl'] || params['ReturnUrl']);
  }

  login(value: Login): Observable<boolean> {
    const body = JSON.stringify(value);
    const options = { headers: this.headers };

    return this.http
      .post<string>(`${this.baseUrl}/v1/Account/Login`, body, options)
      .pipe(map(
        (res: string) => {
          this.token = res;
          this.expiration = new Date();
          this.isLoggedIn.emit(true);
          return true;
        }),
        catchError<boolean, never>(this.handleError));
  }

  logout(): void {
    this.token = undefined;
    this.expiration = undefined;
    this.isLoggedIn.emit(false);
  }

  hasToken = (): boolean => {
    const tokenExists = typeof this.token === 'string' && this.token.length > 0;
    const tokenNotExpired = typeof(this.expiration) !== 'undefined' && this.expiration.getTime() >= Date.now();
    return (tokenExists && tokenNotExpired);
  }

  protected set token(token: string) {
    if (typeof window === 'undefined'){
      return;
    }
    if (typeof token !== 'undefined') {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }

  private get expiration(): Date {
    const expiration = new Date();
    if (typeof window !== 'undefined') {
      const expirationString = localStorage.getItem('expiration');
      let expirationNumber = 0;
      if (expirationString != null) {
        expirationNumber = parseFloat(expirationString);
      }
      if (expirationNumber > 0) {
        expiration.setTime(expirationNumber);
      }
    }
    return expiration;
  }

  private set expiration(time: Date) {
    if (typeof window === 'undefined'){
      return;
    }
    if (typeof time !== 'undefined') {
      const expiration = time.getTime() + 30 * 60000;
      localStorage.setItem('expiration', JSON.stringify(expiration));
    } else {
      localStorage.removeItem('expiration');
    }
  }
}
