import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from 'oidc-client';
import { AccountService } from '../account/account.service';
import { CartService } from '../cart/cart.service';
import { Cart } from '../cart/cart';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

  user: User;
  cart: Cart;

  constructor(
    private readonly accountService: AccountService,
    private readonly cartService: CartService) {
  }

  ngOnInit(): void {
    this.accountService.user.subscribe((user: User) => this.user = user);
    this.cartService.cart.subscribe((cart: Cart) => this.cart = cart);
  }

  ngOnDestroy(): void {
    this.accountService.user.unsubscribe();
    this.cartService.cart.unsubscribe();
  }
}
