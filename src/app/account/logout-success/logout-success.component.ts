import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { CookieService } from 'ngx-cookie-service';
import { AccountService } from '../account.service';
import { CartService } from '../../cart/cart.service';

@Component({
  selector: 'app-account-logout-success',
  templateUrl: './logout-success.component.html',
  styleUrls: ['./logout-success.component.scss']
})
export class LogoutSuccessComponent implements OnInit {

  @BlockUI() blockUI: NgBlockUI;

  constructor(
    private readonly titleService: Title,
    private readonly cookieService: CookieService,
    private readonly accountService: AccountService,
    private readonly cartService: CartService) {
  }

  ngOnInit(): void {
    this.titleService.setTitle('Clarity: Logout');
    this.blockUI.start();
    this.accountService.signoutRedirectCallback$().then(() => {
      this.cookieService.delete('CartId');
      this.cartService.cart$.next(undefined);
    }).finally(() => this.blockUI.stop());
  }
}
