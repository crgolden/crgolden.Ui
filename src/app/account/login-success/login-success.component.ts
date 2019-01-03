import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { User } from 'oidc-client';
import { CookieService } from 'ngx-cookie-service';
import { AccountService } from '../account.service';
import { CartService } from '../../cart/cart.service';
import { Cart } from '../../cart/cart';

@Component({
  selector: 'app-account-login-success',
  templateUrl: './login-success.component.html',
  styleUrls: ['./login-success.component.scss']
})
export class LoginSuccessComponent implements OnInit {

  @BlockUI() blockUI: NgBlockUI;
  errors: Array<string>;

  constructor(
    private readonly titleService: Title,
    private readonly router: Router,
    private readonly cookieService: CookieService,
    private readonly accountService: AccountService,
    private readonly cartService: CartService) {
    this.errors = new Array<string>();
  }

  ngOnInit(): void {
    this.titleService.setTitle('Clarity: Login');
    this.blockUI.start();
    this.accountService.signinRedirectCallback$().then((user: User) => {
      this.accountService.user$.next(user);
      const cartId = this.cookieService.get('CartId');
      if (cartId.length > 0) {
        this.blockUI.start();
        this.cartService.details$(cartId).subscribe(
          (cart: Cart) => {
            this.cartService.cart$.next(cart);
            const returnUrl = window.sessionStorage.getItem('returnUrl');
            if (returnUrl != null) {
              window.sessionStorage.removeItem('returnUrl');
              this.router.navigate([returnUrl]);
            } else {
              this.router.navigate(['/Home']);
            }
          },
          (errors) => this.errors = errors,
          () => this.blockUI.stop());
      }
    }).finally(() => this.blockUI.stop());
  }
}
