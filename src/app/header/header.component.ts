import { Component, OnInit } from '@angular/core';
import { Event, NavigationEnd, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { User } from 'oidc-client';
import { AccountService } from '../account/account.service';
import { CartService } from '../cart/cart.service';
import { Cart } from '../cart/cart';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  user$ = (): Observable<User> => this.accountService.user$;
  cart$ = (): Observable<Cart> => this.cartService.cart$;
  returnUrl: string;

  constructor(
    private readonly router: Router,
    private readonly accountService: AccountService,
    private readonly cartService: CartService) {
  }

  ngOnInit(): void {
    const url = '/Account/Logout';
    this.router.events
      .pipe(
        filter((event: Event) => event instanceof NavigationEnd && !event.url.includes(url)))
      .subscribe(
        (navigationEnd: NavigationEnd) => this.returnUrl = navigationEnd.url);
  }
}
