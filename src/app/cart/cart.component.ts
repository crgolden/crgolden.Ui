import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import {
  GridDataResult,
  PagerSettings,
  SortSettings
} from '@progress/kendo-angular-grid';
import { DataSourceRequestState } from '@progress/kendo-data-query';
import { CartProductsService } from '../cart-products/cart-products.service';
import { CartProduct } from '../cart-products/cart-product';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

  private cartProducts: CartProduct[];
  cartProductsData: GridDataResult;
  cartProductsState: DataSourceRequestState;
  cartProductsPageable: PagerSettings;
  cartProductsSortable: SortSettings;

  constructor(
    private readonly titleService: Title,
    private readonly route: ActivatedRoute,
    private readonly toastr: ToastrService,
    private readonly cartProductsService: CartProductsService) {
    this.cartProductsState = cartProductsService.state;
    this.cartProductsPageable = cartProductsService.pageable;
    this.cartProductsSortable = cartProductsService.sortable;
  }

  ngOnInit(): void {
    this.titleService.setTitle('Clarity: Cart');
    this.cartProducts = this.route.snapshot.data['cart'][0];
    this.cartProductsData = this.route.snapshot.data['cart'][1];
  }

  updateQuantity(quantity: number, cartProduct: CartProduct): void {
    cartProduct.quantity = quantity;
    this.cartProductsService
      .edit$(cartProduct)
      .subscribe(
        () => {
          this.cartProducts.find(
            x => x.productId === cartProduct.productId).quantity = cartProduct.quantity;
          this.cartProductsService.cartProducts$.next(this.cartProducts);
        },
        (errors: string[]) => errors.forEach(error => this.toastr.error(error, null, {
          disableTimeOut: true
        })));
  }

  removeCartProduct(cartProduct: CartProduct): void {
    this.cartProductsService
      .delete$([
        cartProduct.cartId,
        cartProduct.productId
      ])
      .subscribe(
        () => {
          const index = this.cartProducts.findIndex(x => x.productId === cartProduct.productId);
          this.cartProducts.splice(index, 1);
          this.cartProductsService.cartProducts$.next(this.cartProducts);
          this.dataStateChange(this.cartProductsService.state);
        },
        (errors: string[]) => errors.forEach(error => this.toastr.error(error, null, {
          disableTimeOut: true
        })));
  }

  total$ = (): Observable<number> => this.cartProductsService.cartProducts$
    .pipe(map(cartProducts => cartProducts
      .map(cartProduct => cartProduct.productUnitPrice * cartProduct.quantity)
      .reduce((previous, current) => previous + current, 0)));

  quantity$ = (): Observable<number> => this.cartProductsService.cartProducts$
    .pipe(map(cartProducts => cartProducts.length));

  dataStateChange(state: DataSourceRequestState): void {
    this.cartProductsState = this.cartProductsService.state = state;
    this.cartProductsService.index$().subscribe(
      cartProducts => this.cartProductsData = cartProducts,
      (errors: string[]) => errors.forEach(error => this.toastr.error(error, null, {
        disableTimeOut: true
      })));
  }
}
