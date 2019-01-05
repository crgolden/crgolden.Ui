import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { exhaustMap, map } from 'rxjs/operators';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { CookieService } from 'ngx-cookie-service';
import { AccountService } from '../../account/account.service';
import { Product } from '../product';
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
  errors: Array<string>;
  product: Product;
  primaryImageUri: string;
  private cartId: string;

  constructor(
    private readonly titleService: Title,
    private readonly route: ActivatedRoute,
    private readonly accountService: AccountService,
    private readonly cartService: CartService,
    private readonly cartProductsService: CartProductsService,
    cookieService: CookieService) {
    this.cartId = cookieService.get('CartId');
  }

  ngOnInit(): void {
    this.titleService.setTitle('Clarity: Product Details');
    this.product = this.route.snapshot.data['product'] as Product;
    this.setPrimaryImageUri();
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
    this.errors = new Array<string>();
    this.blockUI.start();
    observable.subscribe(
      (cart: Cart) => this.cartService.cart$.next(cart),
      (errors: Array<string>) => this.errors = errors,
      () => this.blockUI.stop());
  }

  removeFromCart(): void {
    this.errors = new Array<string>();
    this.blockUI.start();
    this.cartProductsService.delete$(this.cartId, this.product.id)
      .pipe(exhaustMap(
        () => this.cartService.details$(this.cartId)))
      .subscribe(
        (updatedCart: Cart) => this.cartService.cart$.next(updatedCart),
        (errors: Array<string>) => this.errors = errors,
        () => this.blockUI.stop());
  }

  showActive$ = (): Observable<boolean> => this.accountService.userHasRole$('Admin');
  showEdit$ = (): Observable<boolean> => this.accountService.userHasRole$('Admin');

  private setPrimaryImageUri(): void {
    if (this.product.productFiles.some(x => x.primary)) {
      this.primaryImageUri = this.product.productFiles.find(x => x.primary).uri;
    }
  }
}
