import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserManagerSettings, UserManager, User } from 'oidc-client';
import { environment } from '../../environments/environment';
import { ConfirmEmail } from './models/confirm-email';
import { Register } from './models/register';
import { ForgotPassword } from './models/forgot-password';
import { ResetPassword } from './models/reset-password';

@Injectable()
export class AccountService {

  private readonly scopes = new Array<string>(
    'openid',
    'profile',
    'email',
    'phone',
    'address',
    'api1',
    'api2',
    'identity');
  private readonly responseTypes = new Array<string>(
    'id_token',
    'token');
  private readonly userManager: UserManager;
  user: BehaviorSubject<User>;

  constructor(private readonly http: HttpClient) {
    const domain = `${window.location.protocol}//${window.location.host}`;
    const userManagerSettings: UserManagerSettings = {
      authority: environment.identityUrl,
      client_id: environment.identityClientId,
      redirect_uri: `${domain}/Account/LoginCallback`,
      response_type: this.responseTypes.join(' '),
      scope: this.scopes.join(' '),
      post_logout_redirect_uri: `${domain}/Account/LogoutCallback`,
      filterProtocolClaims: true
    };
    this.userManager = new UserManager(userManagerSettings);
    this.user = new BehaviorSubject<User>(undefined);
    this.userManager.getUser().then((user: User) => this.user.next(user));
  }

  confirmEmail(model: ConfirmEmail): Observable<string> {
    return this.http
      .post<string>(`${environment.identityUrl}/Account/ConfirmEmail`, JSON.stringify(model))
      .pipe(map((response: string) => response));
  }

  forgotPassword(model: ForgotPassword): Observable<string> {
    return this.http
      .post<string>(`${environment.identityUrl}/Account/ForgotPassword`, JSON.stringify(model))
      .pipe(map((response: string) => response));
  }

  register(model: Register): Observable<string> {
    return this.http
      .post<string>(`${environment.identityUrl}/Account/Register`, JSON.stringify(model))
      .pipe(map((response: string) => response));
  }

  resetPassword(model: ResetPassword): Observable<string> {
    return this.http
      .post<string>(`${environment.identityUrl}/Account/ResetPassword`, JSON.stringify(model))
      .pipe(map((response: string) => response));
  }

  signinRedirect(args?: any): Observable<any> {
    return from(this.userManager.signinRedirect(args));
  }

  signinRedirectCallback(url?: string): Observable<void> {
    return from(this.userManager.signinRedirectCallback(url).then((user: User) => this.user.next(user)));
  }

  signoutRedirect(args?: any): Observable<any> {
    return from(this.userManager.signoutRedirect(args));
  }

  signoutRedirectCallback(url?: string): Observable<any> {
    return from(this.userManager.signoutRedirectCallback(url));
  }
}
