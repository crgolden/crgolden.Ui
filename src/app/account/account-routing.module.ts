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
    path: 'confirm-email',
    component: ConfirmEmailComponent,
    canActivate: [AppNotLoggedIn]
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
    canActivate: [AppNotLoggedIn]
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [AppNotLoggedIn]
  },
  {
    path: 'login-success',
    component: LoginSuccessComponent
  },
  {
    path: 'logout',
    component: LogoutComponent,
    canActivate: [AppLoggedIn]
  },
  {
    path: 'logout-success',
    component: LogoutSuccessComponent
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [AppNotLoggedIn]
  },
  {
    path: 'reset-password',
    component: ResetPasswordComponent,
    canActivate: [AppNotLoggedIn]
  },
  {
    path: 'manage',
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
