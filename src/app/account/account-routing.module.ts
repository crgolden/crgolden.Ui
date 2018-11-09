import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DetailsComponent } from './details/details.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ConfirmEmailComponent } from './confirm-email/confirm-email.component';
import { AccountLoggedIn } from './account.logged-in';
import { AccountNotLoggedIn } from './account.not-logged-in';

const routes: Routes = [
  {
    path: 'Details/:id',
    component: DetailsComponent,
    canActivate: [AccountLoggedIn]
  },
  {
    path: 'ConfirmEmail',
    component: ConfirmEmailComponent,
    canActivate: [AccountNotLoggedIn]
  },
  {
    path: 'Login',
    component: LoginComponent,
    canActivate: [AccountNotLoggedIn]
  },
  {
    path: 'Register',
    component: RegisterComponent,
    canActivate: [AccountNotLoggedIn]
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
