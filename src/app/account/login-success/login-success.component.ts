import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { User } from 'oidc-client';
import { CookieService } from 'ngx-cookie-service';
import { AccountService } from '../account.service';
import { CartService } from '../../cart/cart.service';
import { Cart } from '../../cart/cart';
import { CartProduct } from '../../cart-products/cart-product';

@Component({
  selector: 'app-account-login-success',
  templateUrl: './login-success.component.html',
  styleUrls: ['./login-success.component.scss']
})
export class LoginSuccessComponent implements OnInit {

  @BlockUI() blockUI: NgBlockUI;

  constructor(
    private readonly titleService: Title,
    private readonly router: Router,
    private readonly cookieService: CookieService,
    private readonly toastr: ToastrService,
    private readonly accountService: AccountService,
    private readonly cartService: CartService) {
  }

  ngOnInit(): void {
    this.titleService.setTitle('Clarity: Login');
    this.blockUI.start();
    this.accountService.signinRedirectCallback$().then((user: User) => {
      this.accountService.user$.next(user);
      this.blockUI.start();
      const cartId = this.cookieService.get('CartId');
      if (cartId.length > 0) {
        this.cartService.details$(cartId).subscribe(
          (cart: Cart) => this.cartService.cart$.next(cart),
          (errors: Array<string>) => errors.forEach(error => this.toastr.error(error, null, {
            disableTimeOut: true
          })),
          () => this.blockUI.stop());
      } else {
        this.cartService.create$({
          id: undefined,
          name: 'Cart',
          created: undefined,
          total: 0,
          cartProducts: new Array<CartProduct>()
        } as Cart).subscribe(
          (cart: Cart) => this.cartService.cart$.next(cart),
          (errors: Array<string>) => errors.forEach(error => this.toastr.error(error, null, {
            disableTimeOut: true
          })),
          () => this.blockUI.stop());
      }
      const returnUrl = window.sessionStorage.getItem('returnUrl');
      if (returnUrl != null) {
        window.sessionStorage.removeItem('returnUrl');
        this.router.navigate([returnUrl]).finally(() => this.blockUI.stop());
      } else {
        this.router.navigate(['/home']).finally(() => this.blockUI.stop());
      }
    });
  }
}
