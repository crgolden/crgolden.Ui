import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faHome,
  faSignIn,
  faSignOut,
  faUser,
  faUserPlus,
  faAt,
  faEdit
} from '@fortawesome/pro-light-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import { AppInterceptor } from './app.interceptor';
import { AppLoggedIn } from './app.logged-in';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AccountService } from './account/account.service';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';

library.add(
  faHome,
  faSignIn,
  faSignOut,
  faUser,
  faUserPlus,
  faAt,
  faEdit
);

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FontAwesomeModule,
    AppRoutingModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AppInterceptor,
      multi: true
    },
    AppLoggedIn,
    AccountService
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
