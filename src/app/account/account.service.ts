import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs/index';
import { BehaviorSubject } from 'rxjs';
import { map, catchError } from 'rxjs/operators/index';
import { AppService } from '../app.service';
import { Login } from './login/login';
import { Register } from './register/register';
import { User } from './user';

@Injectable()
export class AccountService extends AppService {

  isLoggedIn: BehaviorSubject<boolean>;
  currentUser: User;
  returnUrl: string;

  constructor(
    private readonly http: HttpClient,
    private readonly route: ActivatedRoute,
    protected readonly router: Router) {
    super(router);
    route.queryParams.subscribe((params: Params) => this.returnUrl = params['returnUrl'] || params['ReturnUrl']);
    this.isLoggedIn = new BehaviorSubject<boolean>(this.hasToken());
  }

  login(model: Login): Observable<boolean> {
    const body = JSON.stringify(model);
    const options = { headers: this.headers };

    return this.http
      .post<User>(`${this.baseUrl}/v1/Account/Login`, body, options)
      .pipe(map(
        (res: User) => {
          this.token = res.token;
          this.expiration = new Date();
          this.currentUser = res;
          this.isLoggedIn.next(true);
          return true;
        }),
        catchError<boolean, never>(this.handleError));
  }

  logout(): void {
    this.token = undefined;
    this.expiration = undefined;
    delete this.currentUser;
    this.isLoggedIn.next(false);
  }

  register(model: Register): Observable<boolean> {
    const body = JSON.stringify(model);
    const options = { headers: this.headers };

    return this.http
      .post<User>(`${this.baseUrl}/v1/Account/Register`, body, options)
      .pipe(map(
        (res: User) => {
          this.token = res.token;
          this.expiration = new Date();
          this.currentUser = res;
          this.isLoggedIn.next(true);
          return true;
        }),
        catchError<boolean, never>(this.handleError));
  }

  hasToken = (): boolean => {
    const token = this.token;
    const expiration = this.expiration;
    const tokenExists = typeof token === 'string' && token.length > 0;
    const tokenNotExpired = expiration != null && expiration.getTime() >= Date.now();
    return tokenExists && tokenNotExpired;
  }

  get token(): string {
    if (typeof window === 'undefined') {
      return undefined;
    }
    return localStorage.getItem('token');
  }

  set token(token: string) {
    if (typeof window === 'undefined') {
      return;
    }
    if (typeof token !== 'undefined') {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }

  get expiration(): Date {
    if (typeof window === 'undefined') {
      return undefined;
    }
    const expirationString = localStorage.getItem('expiration');
    if (typeof expirationString !== 'string' || expirationString.length <= 0) {
      return undefined;
    }
    const expirationNumber = parseFloat(expirationString);
    if (expirationNumber <= 0) {
      return undefined;
    }
    return new Date(expirationNumber);
  }

  set expiration(time: Date) {
    if (typeof window === 'undefined') {
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
