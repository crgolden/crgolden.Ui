import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { exhaustMap, map } from 'rxjs/operators';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
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

  state: DataSourceRequestState;
  pageable: PagerSettings;
  sortable: SortSettings;

  @BlockUI() blockUI: NgBlockUI;
  errors: Array<string>;
  cart$ = (): Observable<Cart> => this.cartService.cart$;

  constructor(
    private readonly titleService: Title,
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
    this.titleService.setTitle('Clarity: Cart');
  }

  updateQuantity(quantity: number, cartProduct: CartProduct): void {
    cartProduct.quantity = quantity;
    this.errors = new Array<string>();
    this.blockUI.start();
    this.cartProductsService.edit$(cartProduct)
      .pipe(exhaustMap(
        () => this.cartService.details$(cartProduct.model1Id)))
      .subscribe(
        (cart: Cart) => this.cartService.cart$.next(cart),
        (errors: Array<string>) => this.errors = errors,
        () => this.blockUI.stop());
  }

  removeCartProduct(cartProduct: CartProduct): void {
    this.errors = new Array<string>();
    this.blockUI.start();
    this.cartProductsService.delete$(cartProduct.model1Id, cartProduct.model2Id)
      .pipe(exhaustMap(
        () => this.cartService.details$(cartProduct.model1Id)))
      .subscribe(
        (cart: Cart) => this.cartService.cart$.next(cart),
        (errors: Array<string>) => this.errors = errors,
        () => this.blockUI.stop());
  }

  showProceedToCheckout$(): Observable<boolean> {
    return this.cart$().pipe(map(
      (cart: Cart) => cart != null && cart.cartProducts.length > 0));
  }
}
