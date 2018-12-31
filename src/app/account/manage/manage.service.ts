import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
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

  addExternalLogin$(name: string): Observable<void> {
    return this.http.get<void>(
      `${environment.identityUrl}/Manage/LinkLogin?provider=${name}`);
  }

  changePassword$(model: ChangePassword): Observable<string> {
    return this.http
      .post<string>(`${environment.identityUrl}/Manage/ChangePassword`, JSON.stringify(model));
  }

  disable2fa$(): Observable<string> {
    return this.http
      .post<string>(`${environment.identityUrl}/Manage/Disable2fa`, {});
  }

  deletePersonalData$(model: DeletePersonalData): Observable<void> {
    return this.http
      .post<void>(`${environment.identityUrl}/Manage/DeletePersonalData`, JSON.stringify(model));
  }

  downloadPersonalData$(): Observable<HttpResponse<Blob>> {
    return this.http
      .get(`${environment.identityUrl}/Manage/DownloadPersonalData`,
        {
          observe: 'response',
          responseType: 'blob'
        });
  }

  externalAuthenticationSchemes$(): Observable<Array<AuthenticationScheme>> {
    return this.http
      .get<Array<AuthenticationScheme>>(`${environment.identityUrl}/Manage/ExternalAuthenticationSchemes`);
  }

  forgetTwoFactorClient$(): Observable<string> {
    return this.http
      .post<string>(`${environment.identityUrl}/Manage/ForgetTwoFactorClient`, {});
  }

  generateRecoveryCodes$(): Observable<GenerateRecoveryCodes> {
    return this.http
      .get<GenerateRecoveryCodes>(`${environment.identityUrl}/GenerateRecoveryCodes`);
  }

  isTwoFactorEnabled$(): Observable<boolean> {
    return this.http
      .get<boolean>(`${environment.identityUrl}/Manage/IsTwoFactorEnabled`);
  }

  profile$(model: Profile): Observable<Profile> {
    return this.http
      .post<Profile>(`${environment.identityUrl}/Manage/Profile`, JSON.stringify(model));
  }

  removeLogin$(loginProvider: string, providerKey: string): Observable<ExternalLogins> {
    return this.http
      .post<ExternalLogins>(`${environment.identityUrl}/Manage/RemoveLogin`, JSON.stringify({
        loginProvider: loginProvider,
        providerKey: providerKey
      }));
  }

  resetAuthenticator$(): Observable<string> {
    return this.http
      .post<string>(`${environment.identityUrl}/Manage/ResetAuthenticator`, {});
  }

  sendVerificationEmail$(): Observable<string> {
    return this.http
      .get<string>(`${environment.identityUrl}/Manage/SendVerificationEmail`);
  }

  setPassword$(model: SetPassword): Observable<string> {
    return this.http
      .post<string>(`${environment.identityUrl}/Manage/SetPassword`, JSON.stringify(model));
  }

  verifyAuthenticator$(model: EnableAuthenticator): Observable<EnableAuthenticator> {
    return this.http
      .post<EnableAuthenticator>(`${environment.identityUrl}/Manage/VerifyAuthenticator`, JSON.stringify(model));
  }
}
