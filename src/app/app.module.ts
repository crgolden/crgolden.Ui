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
  faCheck,
  faBox,
  faBoxes,
  faList,
  faInfoSquare,
  faTrash,
  faPlus,
  faBan,
  faShoppingCart
} from '@fortawesome/pro-light-svg-icons';
import { faFacebook } from '@fortawesome/free-brands-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import { CookieService } from 'ngx-cookie-service';
import { AppInterceptor } from './app.interceptor';
import { AppLoggedIn } from './app.logged-in';
import { AppNotLoggedIn } from './app.not-logged-in';
import { AppIsAdmin } from './app.is-admin';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AccountService } from './account/account.service';
import { CartService } from './cart/cart.service';
import { CartProductsService } from './cart-products/cart-products.service';
import { HomeComponent } from './home/home.component';
import { AccessDeniedComponent } from './access-denied/access-denied.component'
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
  faBoxes,
  faList,
  faInfoSquare,
  faTrash,
  faPlus,
  faBan,
  faShoppingCart
);

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AccessDeniedComponent,
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
    CookieService,
    AppLoggedIn,
    AppNotLoggedIn,
    AppIsAdmin,
    AccountService,
    CartService,
    CartProductsService
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
