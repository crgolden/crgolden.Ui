import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AccountService } from '../../account/account.service';
import { ProductsService } from '../products.service';
import { Product } from '../product';
import { CartProduct } from '../../cart-products/cart-product';
import { OrderProduct } from '../../order-products/order-product';

@Component({
  selector: 'app-products-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {

  errors: Array<string>;
  product: Product;

  constructor(
    private readonly titleService: Title,
    private readonly accountService: AccountService,
    private readonly productsService: ProductsService,
    private readonly router: Router) {
    this.product = {
      id: undefined,
      name: undefined,
      active: true,
      created: undefined,
      updated: undefined,
      isDownload: false,
      price: 0,
      description: undefined,
      pictureFileName: undefined,
      pictureUri: undefined,
      cartProducts: new Array<CartProduct>(),
      orderProducts: new Array<OrderProduct>()
    } as Product;
  }

  ngOnInit(): void {
    this.titleService.setTitle('Clarity: Create Product');
  }

  create(form: NgForm): void {
    if (!form.valid) { return; }
    this.productsService.create$(this.product).subscribe(
      (product: Product) => this.router.navigate([`/Products/Details/${product.id}`]),
      (errors: Array<string>) => this.errors = errors);
  }

  showCreate$ = (): Observable<boolean> => this.accountService.userHasRole$('Admin');
}
