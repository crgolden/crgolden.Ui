import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faSignIn } from '@fortawesome/pro-light-svg-icons';
import { AccountRoutingModule } from './account-routing.module';
import { AccountService } from './account.service';
import { LoginComponent } from './login/login.component';

library.add(faSignIn);

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    FontAwesomeModule,
    AccountRoutingModule
  ],
  declarations: [
    LoginComponent
  ],
  providers: [
    AccountService
  ]
})
export class AccountModule {
}
