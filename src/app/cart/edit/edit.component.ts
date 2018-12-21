import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  PagerSettings,
  SortSettings
} from '@progress/kendo-angular-grid';
import {
  DataSourceRequestState,
  SortDescriptor
} from '@progress/kendo-data-query';
import { CartService } from '../cart.service';
import { CartProductsService } from '../../cart-products/cart-products.service';
import { Cart } from '../cart';
import { CartProduct } from '../../cart-products/cart-product';

@Component({
  selector: 'app-cart-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {

  errors: Array<string>;
  cart: Cart;
  cartTotal: number;
  state: DataSourceRequestState;
  pageable: PagerSettings;
  sortable: SortSettings;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly cartService: CartService,
    private readonly cartProductsService: CartProductsService) {
    this.state = {
      skip: 0,
      take: 5,
      sort: new Array<SortDescriptor>({
        field: 'name',
        dir: 'asc'
      })
    } as DataSourceRequestState;
    this.pageable = {
      buttonCount: 1,
      type: 'numeric',
      info: false,
      previousNext: true
    } as PagerSettings;
    this.sortable = {
      allowUnsort: false,
      mode: 'single'
    } as SortSettings;
  }

  ngOnInit(): void {
    this.cart = this.route.snapshot.data['cart'] as Cart;
    this.setCartTotal();
  }

  updateQuantity(event: any, cartProduct: CartProduct): void {
    const quantity = parseInt(event.target.value);
    if (typeof quantity !== 'number') {
      return;
    }
    cartProduct.quantity = quantity;
    this.cartProductsService
      .edit(cartProduct)
      .subscribe(
        () => {
          const index = this.cart.cartProducts.findIndex(x => x.model2Id === cartProduct.model2Id);
          this.cart.cartProducts[index].quantity = cartProduct.quantity;
          this.cart.cartProducts[index].extendedPrice = cartProduct.quantity * cartProduct.price;
          this.cartService.cart.next(this.cart);
          this.setCartTotal();
        },
        (errors: Array<string>) => this.errors = errors);
  }

  removeCartProduct(cartProduct: CartProduct): void {
    this.cartProductsService
      .delete(cartProduct.model1Id, cartProduct.model2Id)
      .subscribe(
        () => {
          const index = this.cart.cartProducts.findIndex(x => x.model2Id === cartProduct.model2Id);
          this.cart.cartProducts.splice(index, 1);
          this.cartService.cart.next(this.cart);
          this.setCartTotal();
        },
        (errors: Array<string>) => this.errors = errors);
  }

  private setCartTotal(): void {
    this.cartTotal = 0;
    this.cart.cartProducts.forEach(x => this.cartTotal += x.extendedPrice);
  }
}
