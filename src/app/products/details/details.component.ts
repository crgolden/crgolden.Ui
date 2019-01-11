import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { exhaustMap, map } from 'rxjs/operators';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { CookieService } from 'ngx-cookie-service';
import { AccountService } from '../../account/account.service';
import { Product } from '../product';
import { File } from '../../files/file';
import { ProductFile } from '../../product-files/product-file';
import { CartService } from '../../cart/cart.service';
import { Cart } from '../../cart/cart';
import { CartProductsService } from '../../cart-products/cart-products.service';
import { CartProduct } from '../../cart-products/cart-product';

@Component({
  selector: 'app-products-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {

  @BlockUI() blockUI: NgBlockUI;
  product: Product;
  primaryImageUri: string;
  images: Array<File>;
  private cartId: string;

  constructor(
    private readonly titleService: Title,
    private readonly route: ActivatedRoute,
    private readonly accountService: AccountService,
    private readonly cartService: CartService,
    private readonly cartProductsService: CartProductsService,
    private readonly toastr: ToastrService,
    cookieService: CookieService) {
    this.cartId = cookieService.get('CartId');
  }

  ngOnInit(): void {
    this.titleService.setTitle('Clarity: Product Details');
    this.product = this.route.snapshot.data['product'] as Product;
    this.images = this.product.productFiles.filter((productFile: ProductFile) =>
      productFile.contentType.includes('image') &&
      productFile.uri.includes('images/')).map((productFile: ProductFile) => {
        return {
          uri: productFile.uri,
          name: productFile.model2Name
      } as File;
    });
    this.setPrimaryImageUri();
    const message = window.sessionStorage.getItem('success');
    if (message != null) {
      window.sessionStorage.removeItem('success');
      setTimeout(() => this.toastr.success(message));
    }
  }

  inCart$(): Observable<boolean> {
    return this.cartService.cart$.pipe(map(
      (cart: Cart) => cart != null &&
        cart.cartProducts != null &&
        cart.cartProducts.some(cartProduct => cartProduct.model2Id === this.product.id)));
  }

  addToCart(): void {
    const observable = this.cartId.length > 0
      ? this.cartProductsService.create$({
        model1Id: this.cartId,
        model1Name: 'Cart',
        model2Id: this.product.id,
        model2Name: this.product.name,
        created: undefined,
        quantity: 1,
        price: this.product.unitPrice,
        extendedPrice: undefined,
        isDownload: this.product.isDownload
      } as CartProduct).pipe(exhaustMap(
        () => this.cartService.details$(this.cartId)))
      : this.cartService.create$({
        id: undefined,
        name: 'Cart',
        created: undefined,
        total: this.product.unitPrice,
        cartProducts: new Array<CartProduct>({
          model1Id: undefined,
          model1Name: 'Cart',
          model2Id: this.product.id,
          model2Name: this.product.name,
          quantity: 1,
          price: this.product.unitPrice,
          extendedPrice: undefined,
          isDownload: this.product.isDownload,
          created: undefined
        } as CartProduct)
      }).pipe(map((cart: Cart) => {
        this.cartId = cart.id;
        return cart;
      }));
    this.blockUI.start();
    observable.subscribe(
      (cart: Cart) => this.cartService.cart$.next(cart),
      (errors: Array<string>) => errors.forEach(error => this.toastr.error(error, null, {
        disableTimeOut: true
      })),
      () => this.blockUI.stop());
  }

  removeFromCart(): void {
    this.blockUI.start();
    this.cartProductsService.delete$(this.cartId, this.product.id)
      .pipe(exhaustMap(
        () => this.cartService.details$(this.cartId)))
      .subscribe(
        (updatedCart: Cart) => this.cartService.cart$.next(updatedCart),
        (errors: Array<string>) => errors.forEach(error => this.toastr.error(error, null, {
          disableTimeOut: true
        })),
        () => this.blockUI.stop());
  }

  showActive$ = (): Observable<boolean> => this.accountService.userHasRole$('Admin');
  showEdit$ = (): Observable<boolean> => this.accountService.userHasRole$('Admin');

  private setPrimaryImageUri(): void {
    if (this.product.productFiles.some(productFile => productFile.primary)) {
      this.primaryImageUri = this.product.productFiles.find(productFile => productFile.primary).uri;
    }
  }
}
