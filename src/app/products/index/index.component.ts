import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { exhaustMap, filter, map } from 'rxjs/operators';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { CookieService } from 'ngx-cookie-service';
import {
  GridDataResult,
  PagerSettings,
  SortSettings
} from '@progress/kendo-angular-grid';
import {
  AggregateDescriptor,
  CompositeFilterDescriptor,
  DataSourceRequestState,
  FilterDescriptor,
  SortDescriptor
} from '@progress/kendo-data-query';
import { AccountService } from '../../account/account.service';
import { ProductsService } from '../products.service';
import { Product } from '../product';
import { CartService } from '../../cart/cart.service';
import { Cart } from '../../cart/cart';
import { CartProductsService } from '../../cart-products/cart-products.service';
import { CartProduct } from '../../cart-products/cart-product';

@Component({
  selector: 'app-products-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {

  @BlockUI() blockUI: NgBlockUI;
  errors: Array<string>;
  products: GridDataResult;
  state: DataSourceRequestState;
  pageable: PagerSettings;
  sortable: SortSettings;
  private cartId: string;

  constructor(
    private readonly titleService: Title,
    private readonly route: ActivatedRoute,
    private readonly accountService: AccountService,
    private readonly productsService: ProductsService,
    private readonly cartService: CartService,
    private readonly cartProductsService: CartProductsService,
    cookieService: CookieService) {
    this.cartId = cookieService.get('CartId');
    this.state = {
      skip: 0,
      take: 5,
      sort: new Array<SortDescriptor>({
        field: 'name',
        dir: 'asc'
      }),
      filter: {
        logic: 'and',
        filters: new Array<FilterDescriptor>()
      } as CompositeFilterDescriptor,
      aggregates: new Array<AggregateDescriptor>()
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
    this.titleService.setTitle('Clarity: Products');
    this.products = this.route.snapshot.data['products'] as GridDataResult;
    this.accountService.userHasRole$('Admin')
      .pipe(filter((response: boolean) => !response))
      .subscribe(() => this.state.filter.filters.push({
        field: 'active',
        operator: 'eq',
        value: true
      } as FilterDescriptor));
  }

  inCart$(productId: string): Observable<boolean> {
    return this.cartService.cart$.pipe(map(
      (cart: Cart) => cart != null &&
        cart.cartProducts != null &&
        cart.cartProducts.some(x => x.model2Id === productId)));
  }

  addToCart(product: Product): void {
    const observable = this.cartId.length > 0
      ? this.cartProductsService.create$({
        model1Id: this.cartId,
        model1Name: 'Cart',
        model2Id: product.id,
        model2Name: product.name,
        created: undefined,
        quantity: 1,
        price: product.price,
        extendedPrice: undefined,
        isDownload: product.isDownload
      } as CartProduct).pipe(exhaustMap(
        () => this.cartService.details$(this.cartId)))
      : this.cartService.create$({
        id: undefined,
        name: 'Cart',
        created: undefined,
        total: product.price,
        cartProducts: new Array<CartProduct>({
          model1Id: undefined,
          model1Name: 'Cart',
          model2Id: product.id,
          model2Name: product.name,
          quantity: 1,
          price: product.price,
          extendedPrice: undefined,
          isDownload: product.isDownload,
          created: undefined
        } as CartProduct)
      }).pipe(map((cart: Cart) => {
        this.cartId = cart.id;
        return cart;
      }));
    this.errors = new Array<string>();
    this.blockUI.start();
    observable.subscribe(
      (cart: Cart) => {
        this.cartService.cart$.next(cart);
        this.dataStateChange(this.state);
      },
      (errors: Array<string>) => this.errors = errors,
      () => this.blockUI.stop());
  }

  removeFromCart(productId: string): void {
    this.errors = new Array<string>();
    this.blockUI.start();
    this.cartProductsService.delete$(this.cartId, productId)
      .pipe(exhaustMap(
        () => this.cartService.details$(this.cartId)))
      .subscribe(
        (cart: Cart) => {
          this.cartService.cart$.next(cart);
          this.dataStateChange(this.state);
        },
        (errors: Array<string>) => this.errors = errors,
        () => this.blockUI.stop());
  }

  dataStateChange(state: DataSourceRequestState): void {
    this.errors = new Array<string>();
    this.state = state;
    this.blockUI.start();
    this.productsService.index$(state).subscribe(
      (result: GridDataResult) => this.products = result,
      (errors: Array<string>) => this.errors = errors,
      () => this.blockUI.stop());
  }

  showAdd$ = (): Observable<boolean> => this.accountService.userHasRole$('Admin');
  showActive$ = (): Observable<boolean> => this.accountService.userHasRole$('Admin');
}
