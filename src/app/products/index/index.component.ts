import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, concatMap, map } from 'rxjs/operators';
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
import { CartService } from '../../cart/cart.service'
import { Cart } from '../../cart/cart';
import { CartProductsService } from '../../cart-products/cart-products.service';
import { CartProduct } from '../../cart-products/cart-product';

@Component({
  selector: 'app-products-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {

  errors: Array<string>;
  products: GridDataResult;
  state: DataSourceRequestState;
  pageable: PagerSettings;
  sortable: SortSettings;

  constructor(
    private readonly titleService: Title,
    private readonly route: ActivatedRoute,
    private readonly accountService: AccountService,
    private readonly productsService: ProductsService,
    private readonly cartService: CartService,
    private readonly cartProductsService: CartProductsService) {
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
      (cart: Cart) => cart != null && cart.cartProducts != null &&
        cart.cartProducts.some(x => x.model2Id === productId)));
  }

  addToCart(product: Product): void {
    this.cartService.cart$.pipe(concatMap(
      (cart: Cart) => cart == null
        ? this.cartService.create$({
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
        })
        : this.cartProductsService.create$({
          model1Id: cart.id,
          model1Name: cart.name,
          model2Id: product.id,
          model2Name: product.name,
          created: undefined,
          updated: undefined,
          quantity: 1,
          price: product.price,
          extendedPrice: undefined,
          isDownload: product.isDownload
        } as CartProduct).pipe(concatMap(
          () => this.cartService.details$(cart.id)))))
      .subscribe(
        (updatedCart: Cart) => {
          this.cartService.cart$.next(updatedCart);
          this.dataStateChange(this.state);
        },
        (errors: Array<string>) => this.errors = errors);
  }

  removeFromCart(productId: string): void {
    this.cartService.cart$.pipe(concatMap(
      (cart: Cart) => this.cartProductsService.delete$(cart.id, productId).pipe(concatMap(
        () => this.cartService.details$(cart.id),
        (_: Object, updatedCart: Cart) => updatedCart)))).subscribe(
          (updatedCart: Cart) => {
            this.cartService.cart$.next(updatedCart);
            this.dataStateChange(this.state);
          },
          (errors: Array<string>) => this.errors = errors);
  }

  dataStateChange(state: DataSourceRequestState): void {
    this.state = state;
    this.productsService
      .index$(state)
      .subscribe(
        (result: GridDataResult) => this.products = result,
        (errors: Array<string>) => this.errors = errors);
  }

  showAdd$ = (): Observable<boolean> => this.accountService.userHasRole$('Admin');
  showActive$ = (): Observable<boolean> => this.accountService.userHasRole$('Admin');
}
