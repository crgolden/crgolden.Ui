import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CookieService } from 'ngx-cookie-service';
import { AccountService } from '../account.service';
import { CartService } from '../../cart/cart.service';

@Component({
  selector: 'app-account-logout-callback',
  templateUrl: './logout-callback.component.html',
  styleUrls: ['./logout-callback.component.scss']
})
export class LogoutCallbackComponent implements OnInit {

  constructor(
    private readonly titleService: Title,
    private readonly cookieService: CookieService,
    private readonly accountService: AccountService,
    private readonly cartService: CartService) {
  }

  ngOnInit(): void {
    this.titleService.setTitle('Clarity: Logout');
    this.accountService
      .signoutRedirectCallback()
      .then(() => {
        this.cookieService.delete('CartId');
        this.cartService.cart.next(undefined);
      });
  }
}
