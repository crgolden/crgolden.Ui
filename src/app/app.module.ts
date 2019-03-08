import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { UrlSerializer } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BlockUIModule } from 'ng-block-ui';
import { BlockUIHttpModule } from 'ng-block-ui/http';
import { CookieService } from 'ngx-cookie-service';
import { ToastrModule } from 'ngx-toastr';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
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
  faCheck,
  faBox,
  faList,
  faInfoSquare,
  faTrash,
  faPlus,
  faBan,
  faShoppingCart,
  faCartPlus,
  faCashRegister,
  faShoppingBag,
  faDollarSign,
  faExclamation
} from '@fortawesome/pro-light-svg-icons';
import {
  faFacebook,
  faCcVisa,
  faCcAmex,
  faCcMastercard,
  faCcDiscover,
  faCcJcb,
  faCcDinersClub,
  faCcStripe
} from '@fortawesome/free-brands-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import { AppInterceptor } from './app.interceptor';
import { LowerCaseUrlSerializer } from './app.lower-case.serializer';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AccessDeniedComponent } from './access-denied/access-denied.component';
import { LogoutSuccessComponent } from './logout-success/logout-success.component';
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
  faCheck,
  faBox,
  faList,
  faInfoSquare,
  faTrash,
  faPlus,
  faBan,
  faShoppingCart,
  faCartPlus,
  faCashRegister,
  faCcVisa,
  faCcAmex,
  faCcMastercard,
  faCcDiscover,
  faCcJcb,
  faCcDinersClub,
  faCcStripe,
  faShoppingBag,
  faDollarSign,
  faExclamation
);

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AccessDeniedComponent,
    LogoutSuccessComponent,
    HeaderComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    BlockUIModule.forRoot(),
    BlockUIHttpModule.forRoot({
      blockAllRequestsInProgress: true
    }),
    ToastrModule.forRoot(),
    FontAwesomeModule,
    AppRoutingModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AppInterceptor,
      multi: true
    },
    {
      provide: UrlSerializer,
      useClass: LowerCaseUrlSerializer
    },
    NgbActiveModal,
    CookieService
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
