import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppLoggedIn } from '../../app.logged-in';
import { LayoutComponent } from './layout/layout.component';
import { ProfileComponent } from './profile/profile.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { SetPasswordComponent } from './set-password/set-password.component';
import { ExternalLoginsComponent } from './external-logins/external-logins.component';
import { TwoFactorAuthenticationComponent } from './two-factor-authentication/two-factor-authentication.component';
import { GenerateRecoveryCodesComponent } from './generate-recovery-codes/generate-recovery-codes.component';
import { Disable2faComponent } from './disable-2fa/disable-2fa.component';
import { EnableAuthenticatorComponent } from './enable-authenticator/enable-authenticator.component';
import { ResetAuthenticatorComponent } from './reset-authenticator/reset-authenticator.component';
import { PersonalDataComponent } from './personal-data/personal-data.component';
import { DeletePersonalDataComponent } from './delete-personal-data/delete-personal-data.component';
import { ExternalLoginsResolver } from './resolvers/external-logins.resolver';
import { AuthenticationSchemesResolver } from './resolvers/authentication-schemes.resolver';
import { HasPasswordResolver } from './resolvers/has-password.resolver';
import { TwoFactorAuthenticationResolver } from './resolvers/two-factor-authentication.resolver';
import { EnableAuthenticatorResolver } from './resolvers/enable-authenticator.resolver';
import { ManageTwoFactorEnabled } from './manage.two-factor-enabled';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AppLoggedIn],
    resolve: {
      authenticationSchemes: AuthenticationSchemesResolver
    },
    children: [
      {
        path: 'ChangePassword',
        component: ChangePasswordComponent,
        canActivate: [AppLoggedIn],
        resolve: {
          hasPassword: HasPasswordResolver
        }
      },
      {
        path: 'DeletePersonalData',
        component: DeletePersonalDataComponent,
        canActivate: [
          AppLoggedIn
        ],
        resolve: {
          hasPassword: HasPasswordResolver
        }
      },
      {
        path: 'Disable2fa',
        component: Disable2faComponent,
        canActivate: [
          AppLoggedIn,
          ManageTwoFactorEnabled
        ]
      },
      {
        path: 'EnableAuthenticator',
        component: EnableAuthenticatorComponent,
        canActivate: [AppLoggedIn],
        resolve: {
          enableAuthenticator: EnableAuthenticatorResolver
        }
      },
      {
        path: 'ExternalLogins',
        component: ExternalLoginsComponent,
        canActivate: [AppLoggedIn],
        resolve: {
          externalLogins: ExternalLoginsResolver
        }
      },
      {
        path: 'GenerateRecoveryCodes',
        component: GenerateRecoveryCodesComponent,
        canActivate: [
          AppLoggedIn,
          ManageTwoFactorEnabled
        ]
      },
      {
        path: 'PersonalData',
        component: PersonalDataComponent,
        canActivate: [AppLoggedIn]
      },
      {
        path: 'Profile',
        component: ProfileComponent,
        canActivate: [AppLoggedIn]
      },
      {
        path: 'ResetAuthenticator',
        component: ResetAuthenticatorComponent,
        canActivate: [AppLoggedIn]
      },
      {
        path: 'SetPassword',
        component: SetPasswordComponent,
        canActivate: [AppLoggedIn],
        resolve: {
          hasPassword: HasPasswordResolver
        }
      },
      {
        path: 'TwoFactorAuthentication',
        component: TwoFactorAuthenticationComponent,
        canActivate: [AppLoggedIn],
        resolve: {
          twoFactorAuthentication: TwoFactorAuthenticationResolver
        }
      },
      {
        path: '',
        redirectTo: 'Profile',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ],
  providers: [
    AuthenticationSchemesResolver,
    ExternalLoginsResolver,
    HasPasswordResolver,
    TwoFactorAuthenticationResolver,
    EnableAuthenticatorResolver,
    ManageTwoFactorEnabled
  ]
})
export class ManageRoutingModule { }
