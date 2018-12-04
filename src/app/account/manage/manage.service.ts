import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
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

  constructor(private readonly http: HttpClient) {
  }

  changePassword(model: ChangePassword): Observable<string> {
    return this.http
      .post<string>(`${environment.identityUrl}/Manage/ChangePassword`, JSON.stringify(model));
  }

  disable2fa(): Observable<string> {
    return this.http
      .post<string>(`${environment.identityUrl}/Manage/Disable2fa`, {});
  }

  deletePersonalData(model: DeletePersonalData): Observable<void> {
    return this.http
      .post<void>(`${environment.identityUrl}/Manage/DeletePersonalData`, JSON.stringify(model));
  }

  downloadPersonalData(): Observable<HttpResponse<Blob>> {
    return this.http
      .get(`${environment.identityUrl}/Manage/DownloadPersonalData`,
        {
          observe: 'response',
          responseType: 'blob'
        });
  }

  enableAuthenticator(): Observable<EnableAuthenticator> {
    return this.http
      .get<EnableAuthenticator>(`${environment.identityUrl}/Manage/EnableAuthenticator`);
  }

  externalAuthenticationSchemes(): Observable<Array<AuthenticationScheme>> {
    return this.http
      .get<Array<AuthenticationScheme>>(`${environment.identityUrl}/Manage/ExternalAuthenticationSchemes`);
  }

  externalLogins(): Observable<ExternalLogins> {
    return this.http
      .get<ExternalLogins>(`${environment.identityUrl}/Manage/ExternalLogins`);
  }

  forgetTwoFactorClient(): Observable<string> {
    return this.http
      .post<string>(`${environment.identityUrl}/Manage/ForgetTwoFactorClient`, {});
  }

  generateRecoveryCodes(): Observable<GenerateRecoveryCodes> {
    return this.http
      .get<GenerateRecoveryCodes>(`${environment.identityUrl}/GenerateRecoveryCodes`);
  }

  hasPassword(): Observable<boolean> {
    return this.http
      .get<boolean>(`${environment.identityUrl}/Manage/HasPassword`);
  }

  isTwoFactorEnabled(): Observable<boolean> {
    return this.http
      .get<boolean>(`${environment.identityUrl}/Manage/IsTwoFactorEnabled`);
  }

  profile(model: Profile): Observable<Profile> {
    return this.http
      .post<Profile>(`${environment.identityUrl}/Manage/Profile`, JSON.stringify(model));
  }

  removeLogin(loginProvider: string, providerKey: string): Observable<ExternalLogins> {
    return this.http
      .post<ExternalLogins>(`${environment.identityUrl}/Manage/RemoveLogin`, JSON.stringify({
        loginProvider: loginProvider,
        providerKey: providerKey
      }));
  }

  resetAuthenticator(): Observable<string> {
    return this.http
      .post<string>(`${environment.identityUrl}/Manage/ResetAuthenticator`, {});
  }

  sendVerificationEmail(): Observable<string> {
    return this.http
      .get<string>(`${environment.identityUrl}/Manage/SendVerificationEmail`);
  }

  setPassword(model: SetPassword): Observable<string> {
    return this.http
      .post<string>(`${environment.identityUrl}/Manage/SetPassword`, JSON.stringify(model));
  }

  twoFactorAuthentication(): Observable<TwoFactorAuthentication> {
    return this.http
      .get<TwoFactorAuthentication>(`${environment.identityUrl}/Manage/TwoFactorAuthentication`);
  }

  verifyAuthenticator(model: EnableAuthenticator): Observable<EnableAuthenticator> {
    return this.http
      .post<EnableAuthenticator>(`${environment.identityUrl}/Manage/VerifyAuthenticator`, JSON.stringify(model));
  }
}
