import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
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
    'api2.full_access',
    'api2.read_only',
    'roles');
  private readonly responseTypes = new Array<string>(
    'id_token',
    'token');
  private readonly userManager: UserManager;
  user$: BehaviorSubject<User>;

  constructor(private readonly http: HttpClient) {
    this.userManager = new UserManager(this.userManagerSettings);
    this.user$ = new BehaviorSubject<User>(undefined);
    this.userManager.getUser().then((user: User) => this.user$.next(user));
  }

  confirmEmail$(model: ConfirmEmail): Observable<string> {
    return this.http
      .post<string>(`${environment.identityUrl}/Account/ConfirmEmail`, JSON.stringify(model));
  }

  forgotPassword$(model: ForgotPassword): Observable<string> {
    return this.http
      .post<string>(`${environment.identityUrl}/Account/ForgotPassword`, JSON.stringify(model));
  }

  register$(model: Register): Observable<string> {
    return this.http
      .post<string>(`${environment.identityUrl}/Account/Register`, JSON.stringify(model));
  }

  resetPassword$(model: ResetPassword): Observable<string> {
    return this.http
      .post<string>(`${environment.identityUrl}/Account/ResetPassword`, JSON.stringify(model));
  }

  signinSilent$(): Observable<User> {
    return from(this.userManager.signinSilent());
  }

  signinRedirect$(args?: any): Observable<any> {
    return from(this.userManager.signinRedirect(args));
  }

  signinRedirectCallback$(url?: string): Observable<User> {
    return from(this.userManager.signinRedirectCallback(url));
  }

  signoutRedirect$(args?: any): Observable<any> {
    return from(this.userManager.signoutRedirect(args));
  }

  signoutRedirectCallback$(url?: string): Observable<any> {
    return from(this.userManager.signoutRedirectCallback(url));
  }

  userHasRole$(role: string): Observable<boolean> {
    const roleType = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';
    return this.user$
      .pipe(
        filter((user: User) => user != null),
        map((user: User) => user.profile[roleType] instanceof Array
          ? user.profile[roleType].includes(role)
          : typeof user.profile[roleType] === 'string'
            ? user.profile[roleType] === role
            : false));
  }

  private get userManagerSettings(): UserManagerSettings {
    const domain = `${window.location.protocol}//${window.location.host}`;
    const userManagerSettings: UserManagerSettings = {
      authority: environment.identityUrl,
      client_id: environment.identityClientId,
      redirect_uri: `${domain}/Account/LoginSuccess`,
      response_type: this.responseTypes.join(' '),
      scope: this.scopes.join(' '),
      post_logout_redirect_uri: `${domain}/Account/LogoutSuccess`,
      filterProtocolClaims: true,
      automaticSilentRenew: true,
      silent_redirect_uri: `${domain}/silent-callback.html`
    };
    return userManagerSettings;
  }
}
