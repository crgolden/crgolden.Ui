import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../../account/account.service';
import { CartProductsService } from '../../cart-products/cart-products.service';
import { Product } from '../product';
import { Cart } from '../../carts/cart';
import { CartProduct } from '../../cart-products/cart-product';

@Component({
  selector: 'app-products-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {

  private cart: Cart;
  private cartProducts: CartProduct[];
  product: Product;

  constructor(
    private readonly titleService: Title,
    private readonly route: ActivatedRoute,
    private readonly toastr: ToastrService,
    private readonly accountService: AccountService,
    private readonly cartProductsService: CartProductsService) {
  }

  ngOnInit(): void {
    this.titleService.setTitle('Clarity: Product Details');
    this.cart = this.route.snapshot.data['details'][0] as Cart;
    this.cartProducts = this.route.snapshot.data['details'][1];
    this.product = this.route.snapshot.data['details'][2];
    const message = window.sessionStorage.getItem('success');
    if (message != null) {
      window.sessionStorage.removeItem('success');
      setTimeout(() => this.toastr.success(message));
    }
  }

  inCart(): boolean {
    return this.cartProducts.some(cartProduct => cartProduct.productId === this.product.id);
  }

  addToCart(): void {
    this.cartProductsService
      .create$(new CartProduct(this.cart, this.product, 1))
      .subscribe(
        cartProduct => {
          this.cartProducts.push(cartProduct);
          this.cartProductsService.cartProducts$.next(this.cartProducts);
        },
        (errors: string[]) => errors.forEach(error => this.toastr.error(error, null, {
          disableTimeOut: true
        })));
  }

  removeFromCart(): void {
    this.cartProductsService
      .delete$([
        this.cart.id,
        this.product.id
      ])
      .subscribe(
        () => {
          const index = this.cartProducts.findIndex(
            cartProduct => cartProduct.productId === this.product.id);
          this.cartProducts.splice(index, 1);
          this.cartProductsService.cartProducts$.next(this.cartProducts);
        },
        (errors: string[]) => errors.forEach(error => this.toastr.error(error, null, {
          disableTimeOut: true
        })));
  }

  showActive$ = (): Observable<boolean> => this.accountService.userHasRole$('Admin');

  showEdit$ = (): Observable<boolean> => this.accountService.userHasRole$('Admin');
}
