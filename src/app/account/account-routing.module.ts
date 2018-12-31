import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { LoginSuccessComponent } from './login-success/login-success.component';
import { LogoutSuccessComponent } from './logout-success/logout-success.component';
import { RegisterComponent } from './register/register.component';
import { ConfirmEmailComponent } from './confirm-email/confirm-email.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { AppLoggedIn } from '../app.logged-in';
import { AppNotLoggedIn } from '../app.not-logged-in';

const routes: Routes = [
  {
    path: 'ConfirmEmail',
    component: ConfirmEmailComponent,
    canActivate: [AppNotLoggedIn]
  },
  {
    path: 'ForgotPassword',
    component: ForgotPasswordComponent,
    canActivate: [AppNotLoggedIn]
  },
  {
    path: 'Login',
    component: LoginComponent,
    canActivate: [AppNotLoggedIn]
  },
  {
    path: 'LoginSuccess',
    component: LoginSuccessComponent
  },
  {
    path: 'Logout',
    component: LogoutComponent,
    canActivate: [AppLoggedIn]
  },
  {
    path: 'LogoutSuccess',
    component: LogoutSuccessComponent
  },
  {
    path: 'Register',
    component: RegisterComponent,
    canActivate: [AppNotLoggedIn]
  },
  {
    path: 'ResetPassword',
    component: ResetPasswordComponent,
    canActivate: [AppNotLoggedIn]
  },
  {
    path: 'Manage',
    loadChildren: './manage/manage.module#ManageModule'
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AccountRoutingModule { }
