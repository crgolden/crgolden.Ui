import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AccountService } from '../../account/account.service';
import { CartService } from '../../cart/cart.service';
import { Product } from '../product';
import { Cart } from '../../cart/cart';
import { CartProduct } from '../../cart-products/cart-product';

@Component({
  selector: 'app-products-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {

  errors: Array<string>;
  product: Product;
  cart: Cart;
  cartProduct: CartProduct;
  showEdit: boolean;
  showDelete: boolean;
  inCart: boolean;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly accountService: AccountService,
    private readonly cartService: CartService) {
  }

  ngOnInit(): void {
    this.product = this.route.snapshot.data['product'] as Product;
    this.accountService.userHasRole('Admin').subscribe((response: boolean) => {
      this.showDelete = response;
      this.showEdit = response;
    });
    this.cartService.cart.subscribe((cart: Cart) => {
      this.cart = cart;
      this.inCart = typeof cart !== 'undefined' && cart.cartProducts != null &&
        cart.cartProducts.some(cartProduct => cartProduct.model2Id === this.product.id);
      this.setCartProduct();
    });
  }

  addToCart(): void {
    if (typeof this.cart === 'undefined') {
      const cart: Cart = {
        id: undefined,
        name: 'Cart',
        cartProducts: new Array<CartProduct>(this.cartProduct)
      };
      this.cartService
        .create(cart)
        .subscribe(
          (value: Cart) => this.cartService.cart.next(value),
          (errors: Array<string>) => this.errors = errors);
    } else {
      this.cart.cartProducts.push(this.cartProduct);
      this.cartService
        .edit(this.cart)
        .subscribe(
          () => this.cartService.cart.next(this.cart),
          (errors: Array<string>) => this.errors = errors);
    }
  }

  removeFromCart(): void {
    const index = this.cart.cartProducts.findIndex(cartProduct => cartProduct.model2Id === this.product.id);
    this.cart.cartProducts.splice(index, 1);
    this.cartService
      .edit(this.cart)
      .subscribe(
        () => this.cartService.cart.next(this.cart),
        (errors: Array<string>) => this.errors = errors);
  }

  private setCartProduct(): void {
    if (this.cart == null) {
      this.cartProduct = {
        model1Id: undefined,
        model1Name: 'Cart',
        model2Id: this.product.id,
        model2Name: this.product.name,
        quantity: 1,
        price: this.product.price,
        extendedPrice: undefined
      };
    } else {
      this.cartProduct = {
        model1Id: this.cart.id,
        model1Name: this.cart.name,
        model2Id: this.product.id,
        model2Name: this.product.name,
        quantity: 1,
        price: this.product.price,
        extendedPrice: undefined
      };
    }
  }
}
