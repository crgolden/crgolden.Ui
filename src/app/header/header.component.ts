import { Location } from '@angular/common';
import { Component, OnInit, } from '@angular/core';
import { Event, NavigationEnd, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map, skipWhile } from 'rxjs/operators';
import { ActionType } from '../app.action-type';
import { AccountService } from '../account/account.service';
import { CartProductsService } from '../cart-products/cart-products.service';
import { CartProduct } from '../cart-products/cart-product';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  returnUrl: string;
  userIsLoggedIn$ = (): Observable<boolean> => this.accountService.user$
    .pipe(map(user => user != null && !user.expired));
  cartProducts$ = (): Observable<CartProduct[]> => this.cartProductsService.cartProducts$
    .pipe(skipWhile(cartProducts => cartProducts == null))
    .pipe(map(cartProducts => cartProducts));

  constructor(
    private readonly location: Location,
    private readonly router: Router,
    private readonly accountService: AccountService,
    private readonly cartProductsService: CartProductsService) {
  }

  ngOnInit(): void {
    const path = this.location.normalize(this.location.path());
    if (path !== '/' && !path.includes('login') && !path.includes('logout')) {
      this.accountService.setUser(ActionType.Load);
    }
    this.router.events
      .pipe(filter((event: Event) => event instanceof NavigationEnd && event.url !== '/'))
      .subscribe((event: NavigationEnd) => {
        if (!event.url.includes('logout')) {
          this.returnUrl = event.url;
        }
      });
  }
}
