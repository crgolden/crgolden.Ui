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
  faUserLock,
  faAt,
  faEdit,
  faKey,
  faLock,
  faCheck
} from '@fortawesome/pro-light-svg-icons';
import { faFacebook } from '@fortawesome/free-brands-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import { AppInterceptor } from './app.interceptor';
import { AppLoggedIn } from './app.logged-in';
import { AppNotLoggedIn } from './app.not-logged-in';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AccountService } from './account/account.service';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';

library.add(
  faHome,
  faSignIn,
  faSignOut,
  faUser,
  faUserPlus,
  faUserLock,
  faAt,
  faEdit,
  faKey,
  faFacebook,
  faLock,
  faCheck
);

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
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
    AppNotLoggedIn,
    AccountService
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
