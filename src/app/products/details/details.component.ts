import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { concatMap, map } from 'rxjs/operators';
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

  errors: Array<string>;
  product: Product;

  constructor(
    private readonly titleService: Title,
    private readonly route: ActivatedRoute,
    private readonly accountService: AccountService,
    private readonly cartService: CartService,
    private readonly cartProductsService: CartProductsService) {
  }

  ngOnInit(): void {
    this.titleService.setTitle('Clarity: Product Details');
    this.product = this.route.snapshot.data['product'] as Product;
  }

  inCart$ = (): Observable<boolean> => this.cartService.cart$
    .pipe(map((cart: Cart) => cart != null && cart.cartProducts != null &&
      cart.cartProducts.some(cartProduct => cartProduct.model2Id === this.product.id)));

  addToCart(): void {
    this.cartService.cart$.pipe(concatMap(
      (cart: Cart) => cart == null
        ? this.cartService.create$({
          id: undefined,
          name: 'Cart',
          created: undefined,
          total: this.product.price,
          cartProducts: new Array<CartProduct>({
            model1Id: undefined,
            model1Name: 'Cart',
            model2Id: this.product.id,
            model2Name: this.product.name,
            quantity: 1,
            price: this.product.price,
            extendedPrice: undefined,
            isDownload: this.product.isDownload,
            created: undefined
          } as CartProduct)
        })
        : this.cartProductsService.create$({
          model1Id: cart.id,
          model1Name: cart.name,
          model2Id: this.product.id,
          model2Name: this.product.name,
          quantity: 1,
          price: this.product.price,
          extendedPrice: undefined,
          isDownload: this.product.isDownload,
          created: undefined
        } as CartProduct).pipe(concatMap(
          () => this.cartService.details$(cart.id)))))
      .subscribe(
        (updatedCart: Cart) => this.cartService.cart$.next(updatedCart),
        (errors: Array<string>) => this.errors = errors);
  }

  removeFromCart(): void {
    this.cartService.cart$.pipe(concatMap(
      (cart: Cart) => this.cartProductsService.delete$(cart.id, this.product.id).pipe(concatMap(
        () => this.cartService.details$(cart.id),
        (_: Object, updatedCart: Cart) => updatedCart)))).subscribe(
          (updatedCart: Cart) => this.cartService.cart$.next(updatedCart),
          (errors: Array<string>) => this.errors = errors);
  }

  showActive$ = (): Observable<boolean> => this.accountService.userHasRole$('Admin');
  showEdit$ = (): Observable<boolean> => this.accountService.userHasRole$('Admin');
}
