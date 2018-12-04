import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AccountRoutingModule } from './account-routing.module';
import { ConfirmEmailComponent } from './confirm-email/confirm-email.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { LoginCallbackComponent } from './login-callback/login-callback.component';
import { LogoutCallbackComponent } from './logout-callback/logout-callback.component';
import { RegisterComponent } from './register/register.component';
import { ManageModule } from './manage/manage.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    AccountRoutingModule,
    ManageModule
  ],
  declarations: [
    ConfirmEmailComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    LoginComponent,
    LogoutComponent,
    LoginCallbackComponent,
    LogoutCallbackComponent,
    RegisterComponent
  ]
})
export class AccountModule {
}
