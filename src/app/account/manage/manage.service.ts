import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Profile } from './models/profile';
import { AuthenticationScheme } from './models/authentication-scheme';
import { ExternalLogins } from './models/external-logins';
import { ChangePassword } from './models/change-password';
import { SetPassword } from './models/set-password';
import { TwoFactorAuthentication } from './models/two-factor-authentication';
import { GenerateRecoveryCodes } from './models/generate-recovery-codes';
import { EnableAuthenticator } from './models/enable-authenticator';
import { DeletePersonalData } from './models/delete-personal-data';

@Injectable()
export class ManageService {

  hasPassword: BehaviorSubject<boolean>;
  enableAuthenticator: BehaviorSubject<EnableAuthenticator>;
  externalLogins: BehaviorSubject<ExternalLogins>;
  twoFactorAuthentication: BehaviorSubject<TwoFactorAuthentication>;

  constructor(private readonly http: HttpClient) {
    this.hasPassword = new BehaviorSubject<boolean>(undefined);
    this.enableAuthenticator = new BehaviorSubject<EnableAuthenticator>(undefined);
    this.externalLogins = new BehaviorSubject<ExternalLogins>(undefined);
    this.twoFactorAuthentication = new BehaviorSubject<TwoFactorAuthentication>(undefined);
  }

  protected get headers(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json'
    });
  }

  addExternalLogin$(name: string): Observable<void> {
    return this.http.get<void>(
      `${environment.identityUrl}/manage/link-login?provider=${name}`);
  }

  changePassword$(model: ChangePassword): Observable<string> {
    return this.http
      .post<string>(`${environment.identityUrl}/manage/change-password`, JSON.stringify(model), {
        headers: this.headers
      });
  }

  disable2fa$(): Observable<string> {
    return this.http
      .post<string>(`${environment.identityUrl}/manage/disable2fa`, {}, {
        headers: this.headers
      });
  }

  deletePersonalData$(model: DeletePersonalData): Observable<void> {
    return this.http
      .post<void>(`${environment.identityUrl}/manage/delete-personal-data`, JSON.stringify(model), {
        headers: this.headers
      });
  }

  downloadPersonalData$(): Observable<HttpResponse<Blob>> {
    return this.http
      .get(`${environment.identityUrl}/manage/download-personal-data`,
        {
          observe: 'response',
          responseType: 'blob'
        });
  }

  externalAuthenticationSchemes$(): Observable<Array<AuthenticationScheme>> {
    return this.http
      .get<Array<AuthenticationScheme>>(`${environment.identityUrl}/manage/external-authentication-schemes`);
  }

  forgetTwoFactorClient$(): Observable<string> {
    return this.http
      .post<string>(`${environment.identityUrl}/manage/forget-two-factor-client`, {}, {
        headers: this.headers
      });
  }

  generateRecoveryCodes$(): Observable<GenerateRecoveryCodes> {
    return this.http
      .get<GenerateRecoveryCodes>(`${environment.identityUrl}/generate-recovery-codes`);
  }

  isTwoFactorEnabled$(): Observable<boolean> {
    return this.http
      .get<boolean>(`${environment.identityUrl}/manage/is-two-factor-enabled`);
  }

  profile$(model: Profile): Observable<Profile> {
    return this.http
      .post<Profile>(`${environment.identityUrl}/manage/profile`, JSON.stringify(model), {
        headers: this.headers
      });
  }

  removeLogin$(loginProvider: string, providerKey: string): Observable<ExternalLogins> {
    return this.http
      .post<ExternalLogins>(`${environment.identityUrl}/manage/remove-login`, JSON.stringify({
        loginProvider: loginProvider,
        providerKey: providerKey
      }), {
          headers: this.headers
        });
  }

  resetAuthenticator$(): Observable<string> {
    return this.http
      .post<string>(`${environment.identityUrl}/manage/reset-authenticator`, {}, {
        headers: this.headers
      });
  }

  sendVerificationEmail$(): Observable<string> {
    return this.http
      .get<string>(`${environment.identityUrl}/manage/send-verification-email`);
  }

  setPassword$(model: SetPassword): Observable<string> {
    return this.http
      .post<string>(`${environment.identityUrl}/manage/set-password`, JSON.stringify(model), {
        headers: this.headers
      });
  }

  verifyAuthenticator$(model: EnableAuthenticator): Observable<EnableAuthenticator> {
    return this.http
      .post<EnableAuthenticator>(`${environment.identityUrl}/manage/verify-authenticator`, JSON.stringify(model), {
        headers: this.headers
      });
  }
}
