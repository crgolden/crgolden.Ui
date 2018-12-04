import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { QRCodeModule } from 'angularx-qrcode';
import { ManageRoutingModule } from './manage-routing.module';
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
import { ManageService } from './manage.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    QRCodeModule,
    ManageRoutingModule
  ],
  declarations: [
    LayoutComponent,
    ProfileComponent,
    ChangePasswordComponent,
    SetPasswordComponent,
    ExternalLoginsComponent,
    TwoFactorAuthenticationComponent,
    GenerateRecoveryCodesComponent,
    Disable2faComponent,
    EnableAuthenticatorComponent,
    ResetAuthenticatorComponent,
    PersonalDataComponent,
    DeletePersonalDataComponent
  ],
  providers: [
    ManageService
  ]
})
export class ManageModule {
}
