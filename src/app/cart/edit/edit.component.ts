import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { concatMap, map } from 'rxjs/operators';
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
  cart$ = (): Observable<Cart> => this.cartService.cart$;
  state: DataSourceRequestState;
  pageable: PagerSettings;
  sortable: SortSettings;

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
    this.cartProductsService.edit$(cartProduct)
      .pipe(concatMap(
        () => this.cartService.details$(cartProduct.model1Id),
        (response: Object, cart: Cart) => cart))
      .subscribe(
        (cart: Cart) => this.cartService.cart$.next(cart),
        (errors: Array<string>) => this.errors = errors);
  }

  removeCartProduct(cartProduct: CartProduct): void {
    this.cartProductsService.delete$(cartProduct.model1Id, cartProduct.model2Id)
      .pipe(concatMap(
        () => this.cartService.details$(cartProduct.model1Id),
        (response: Object, cart: Cart) => cart))
      .subscribe(
        (cart: Cart) => this.cartService.cart$.next(cart),
        (errors: Array<string>) => this.errors = errors);
  }

  showProceedToCheckout$ = (): Observable<boolean> => this.cart$()
    .pipe(map((cart: Cart) => cart != null && cart.cartProducts.length > 0));
}
