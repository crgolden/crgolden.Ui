import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AccountRoutingModule } from './account-routing.module';
import { AccountLoggedIn } from './account.logged-in';
import { AccountNotLoggedIn } from './account.not-logged-in';
import { DetailsComponent } from './details/details.component';
import { ConfirmEmailComponent } from './confirm-email/confirm-email.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    FontAwesomeModule,
    AccountRoutingModule
  ],
  declarations: [
    DetailsComponent,
    ConfirmEmailComponent,
    LoginComponent,
    RegisterComponent
  ],
  providers: [
    AccountLoggedIn,
    AccountNotLoggedIn
  ]
})
export class AccountModule {
}
