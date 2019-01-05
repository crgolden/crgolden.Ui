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
      externalLogins: ExternalLoginsResolver,
      hasPassword: HasPasswordResolver
    },
    children: [
      {
        path: 'change-password',
        component: ChangePasswordComponent,
        canActivate: [AppLoggedIn],
        resolve: {
          hasPassword: HasPasswordResolver
        }
      },
      {
        path: 'delete-personal-data',
        component: DeletePersonalDataComponent,
        canActivate: [AppLoggedIn],
        resolve: {
          hasPassword: HasPasswordResolver
        }
      },
      {
        path: 'disable-2fa',
        component: Disable2faComponent,
        canActivate: [
          AppLoggedIn,
          ManageTwoFactorEnabled
        ]
      },
      {
        path: 'enable-authenticator',
        component: EnableAuthenticatorComponent,
        canActivate: [AppLoggedIn],
        resolve: {
          enableAuthenticator: EnableAuthenticatorResolver
        }
      },
      {
        path: 'external-logins',
        component: ExternalLoginsComponent,
        canActivate: [AppLoggedIn],
        resolve: {
          externalLogins: ExternalLoginsResolver,
          hasPassword: HasPasswordResolver
        }
      },
      {
        path: 'generate-recovery-codes',
        component: GenerateRecoveryCodesComponent,
        canActivate: [
          AppLoggedIn,
          ManageTwoFactorEnabled
        ]
      },
      {
        path: 'personal-data',
        component: PersonalDataComponent,
        canActivate: [AppLoggedIn]
      },
      {
        path: 'profile',
        component: ProfileComponent,
        canActivate: [AppLoggedIn]
      },
      {
        path: 'reset-authenticator',
        component: ResetAuthenticatorComponent,
        canActivate: [AppLoggedIn]
      },
      {
        path: 'set-password',
        component: SetPasswordComponent,
        canActivate: [AppLoggedIn],
        resolve: {
          hasPassword: HasPasswordResolver
        }
      },
      {
        path: 'two-factor-authentication',
        component: TwoFactorAuthenticationComponent,
        canActivate: [AppLoggedIn],
        resolve: {
          twoFactorAuthentication: TwoFactorAuthenticationResolver
        }
      },
      {
        path: '',
        redirectTo: 'profile',
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
    ExternalLoginsResolver,
    HasPasswordResolver,
    TwoFactorAuthenticationResolver,
    EnableAuthenticatorResolver,
    ManageTwoFactorEnabled
  ]
})
export class ManageRoutingModule { }
