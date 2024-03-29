import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import {
  GridDataResult,
  PagerSettings,
  SortSettings
} from '@progress/kendo-angular-grid';
import { DataSourceRequestState } from '@progress/kendo-data-query';
import { AccountService } from '../../account/account.service';
import { ProductsController } from '../products.controller';
import { CartProductsController } from '../../cart-products/cart-products.controller';
import { CartProductsService } from '../../cart-products/cart-products.service';
import { Cart } from '../../carts/cart';
import { CartProduct } from '../../cart-products/cart-product';
import { Product } from '../../products/product';

@Component({
  selector: 'app-products-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {

  private cart: Cart;
  private cartProducts: CartProduct[];
  products: GridDataResult;
  state: DataSourceRequestState;
  pageable: PagerSettings;
  sortable: SortSettings;
  isList: boolean;

  constructor(
    private readonly titleService: Title,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly toastr: ToastrService,
    private readonly accountService: AccountService,
    private readonly productsController: ProductsController,
    private readonly cartProductsController: CartProductsController,
    private readonly cartProductsService: CartProductsService) {
  }

  ngOnInit(): void {
    this.titleService.setTitle('crgolden: Products');
    this.cart = this.route.snapshot.data['index'][0] as Cart;
    this.cartProducts = this.route.snapshot.data['index'][1];
    this.products = this.route.snapshot.data['index'][2];
    this.state = this.productsController.state;
    this.pageable = this.productsController.pageable;
    this.sortable = this.productsController.sortable;
    this.isList = this.productsController.isList;
  }

  inCart(productId: string): boolean {
    return this.cartProducts.some(cartProduct => cartProduct.productId === productId);
  }

  addToCart(product: Product): void {
    this.cartProductsController
      .create$(new CartProduct(this.cart, product, 1))
      .subscribe(
        cartProduct => {
          this.cartProducts.push(cartProduct);
          this.cartProductsService.cartProducts$.next(this.cartProducts);
        },
        (errors: string[]) => errors.forEach(error => this.toastr.error(error, null, {
          disableTimeOut: true
        })));
  }

  removeFromCart(productId: string): void {
    this.cartProductsController
      .delete$([
        this.cart.id,
        productId
      ])
      .subscribe(
        () => {
          const index = this.cartProducts.findIndex(
            cartProduct => cartProduct.productId === productId);
          this.cartProducts.splice(index, 1);
          this.cartProductsService.cartProducts$.next(this.cartProducts);
        },
        (errors: string[]) => errors.forEach(error => this.toastr.error(error, null, {
          disableTimeOut: true
        })));
  }

  dataStateChange(state: DataSourceRequestState): void {
    this.state = this.productsController.state = state;
    this.productsController.list$().subscribe(
      products => this.products = products,
      (errors: string[]) => errors.forEach(error => this.toastr.error(error, null, {
        disableTimeOut: true
      })));
  }

  gotToDetails(productId: string): void {
    this.router.navigate([`/products/details/${productId}`]);
  }

  showAdd$ = (): Observable<boolean> => this.accountService.userHasRole$('Admin');

  showActive$ = (): Observable<boolean> => this.accountService.userHasRole$('Admin');

  showGrid(): void {
    this.isList = this.productsController.isList = false;
  }

  showList(): void {
    this.isList = this.productsController.isList = true;
  }
}
