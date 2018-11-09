import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/index';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators/index';
import { environment } from '../../environments/environment';
import { BaseModelService } from '../base/base-model.service';
import { ConfirmEmail } from './confirm-email/confirm-email';
import { Login } from './login/login';
import { Register } from './register/register';
import { Account } from './account';

@Injectable()
export class AccountService extends BaseModelService<Account> {

  account: BehaviorSubject<Account>;

  constructor(protected readonly http: HttpClient) {
    super('Account', http);
    this.account = new BehaviorSubject<Account>(undefined);
    if (typeof window === 'undefined') { return; }
    const account = window.localStorage.getItem('account');
    if (typeof account !== 'string' || account.length <= 0) { return; }
    this.account.next(JSON.parse(account));
  }

  confirmEmail(model: ConfirmEmail): Observable<string> {
    return this.http
      .post<string>(`${environment.apiUrl}/Account/ConfirmEmail`, JSON.stringify(model))
      .pipe(map((response: string) => response));
  }

  login(model: Login): Observable<Login> {
    return this.http
      .post<Login>(`${environment.apiUrl}/Account/Login`, JSON.stringify(model))
      .pipe(map((response: Login) => {
        this.account.next(response.account);
        if (typeof window === 'undefined') { return response; }
        window.localStorage.setItem('account', JSON.stringify(response.account));
        return response;
      }));
  }

  logout(): void {
    this.http
      .post(`${environment.apiUrl}/Account/Logout`, null)
      .subscribe(() => {
        this.account.next(null);
        if (typeof window === 'undefined') { return; }
        window.localStorage.removeItem('account');
      });
  }

  register(model: Register): Observable<string> {
    return this.http
      .post<string>(`${environment.apiUrl}/Account/Register`, JSON.stringify(model))
      .pipe(map((response: string) => response));
  }
}
