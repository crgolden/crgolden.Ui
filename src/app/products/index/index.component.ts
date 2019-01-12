import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { exhaustMap, filter, map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
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

  products: GridDataResult;
  state: DataSourceRequestState;
  pageable: PagerSettings;
  sortable: SortSettings;
  isList: boolean;
  private cartId: string;

  constructor(
    private readonly titleService: Title,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly toastr: ToastrService,
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
        price: product.unitPrice,
        extendedPrice: undefined,
        isDownload: product.isDownload
      } as CartProduct).pipe(exhaustMap(
        () => this.cartService.details$(this.cartId)))
      : this.cartService.create$({
        id: undefined,
        name: 'Cart',
        created: undefined,
        total: product.unitPrice,
        cartProducts: new Array<CartProduct>({
          model1Id: undefined,
          model1Name: 'Cart',
          model2Id: product.id,
          model2Name: product.name,
          quantity: 1,
          price: product.unitPrice,
          extendedPrice: undefined,
          isDownload: product.isDownload,
          created: undefined
        } as CartProduct)
      }).pipe(map((cart: Cart) => {
        this.cartId = cart.id;
        return cart;
      }));
    observable.subscribe(
      (cart: Cart) => {
        this.cartService.cart$.next(cart);
        this.dataStateChange(this.state);
      },
      (errors: Array<string>) => errors.forEach(error => this.toastr.error(error, null, {
        disableTimeOut: true
      })));
  }

  removeFromCart(productId: string): void {
    this.cartProductsService.delete$(this.cartId, productId)
      .pipe(exhaustMap(
        () => this.cartService.details$(this.cartId)))
      .subscribe(
        (cart: Cart) => {
          this.cartService.cart$.next(cart);
          this.dataStateChange(this.state);
        },
        (errors: Array<string>) => errors.forEach(error => this.toastr.error(error, null, {
          disableTimeOut: true
        })));
  }

  dataStateChange(state: DataSourceRequestState): void {
    this.state = state;
    this.productsService.index$(state).subscribe(
      (result: GridDataResult) => this.products = result,
      (errors: Array<string>) => errors.forEach(error => this.toastr.error(error, null, {
        disableTimeOut: true
      })));
  }

  getThumbnailUrl(product: Product): string {
    if (!product.productFiles || product.productFiles.length === 0) {
      return undefined;
    }
    const primaryImages = product.productFiles.filter(productFile =>
      productFile.contentType.includes('image') &&
      !productFile.uri.includes('thumbnail'));
    let primaryImageFile = primaryImages.find(productFile => productFile.primary);
    if (primaryImageFile == null && primaryImages.length > 0) {
      primaryImageFile = primaryImages[0];
    }
    if (primaryImageFile == null) {
      return undefined;
    }
    const start = primaryImageFile.uri.lastIndexOf('/') + 1;
    let end = primaryImageFile.uri.indexOf('?');
    const fileName = primaryImageFile.uri.substring(start, end);
    end = fileName.indexOf('.');
    const id = fileName.substring(0, end);
    const thumbnailImageFile = product.productFiles.find(productFile =>
      productFile.uri.includes(id) &&
      productFile.uri.includes('thumbnails'));
    if (thumbnailImageFile == null) {
      return undefined;
    }
    return thumbnailImageFile.uri;
  }

  gotToDetails(productId: string): void {
    this.router.navigate([`/products/details/${productId}`]);
  }

  showAdd$ = (): Observable<boolean> => this.accountService.userHasRole$('Admin');
  showActive$ = (): Observable<boolean> => this.accountService.userHasRole$('Admin');

  showGrid(): void {
    this.isList = false;
  }

  showList(): void {
    this.isList = true;
  }
}
