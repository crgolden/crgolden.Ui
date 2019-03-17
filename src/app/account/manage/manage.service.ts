import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ManageController } from '@clarity/oidc-controllers';
import { ExternalLogins } from '@clarity/oidc-models';
import { TwoFactorAuthentication } from '@clarity/oidc-models';
import { EnableAuthenticator } from '@clarity/oidc-models';

@Injectable()
export class ManageService extends ManageController {

  hasPassword: BehaviorSubject<boolean>;
  enableAuthenticator: BehaviorSubject<EnableAuthenticator>;
  externalLogins: BehaviorSubject<ExternalLogins>;
  twoFactorAuthentication: BehaviorSubject<TwoFactorAuthentication>;

  constructor(http: HttpClient) {
    super(environment.identityUrl, http);
    this.hasPassword = new BehaviorSubject<boolean>(undefined);
    this.enableAuthenticator = new BehaviorSubject<EnableAuthenticator>(undefined);
    this.externalLogins = new BehaviorSubject<ExternalLogins>(undefined);
    this.twoFactorAuthentication = new BehaviorSubject<TwoFactorAuthentication>(undefined);
  }
}
