import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { AccountService } from '../../account/account.service';
import { ProductsService } from '../products.service';
import { Product } from '../product';
import { CartProduct } from '../../cart-products/cart-product';
import { OrderProduct } from '../../order-products/order-product';
import { ProductFile } from '../../product-files/product-file';
import { ProductCategory } from '../../product-categories/product-category';

@Component({
  selector: 'app-products-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {

  @BlockUI() blockUI: NgBlockUI;
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
      unitPrice: 0,
      quantityPerUnit: undefined,
      unitsInStock: undefined,
      unitsOnOrder: undefined,
      reorderLevel: undefined,
      description: undefined,
      cartProducts: new Array<CartProduct>(),
      orderProducts: new Array<OrderProduct>(),
      productFiles: new Array<ProductFile>(),
      productCategories: new Array<ProductCategory>()
    } as Product;
  }

  ngOnInit(): void {
    this.titleService.setTitle('Clarity: Create Product');
  }

  create(form: NgForm): void {
    this.errors = new Array<string>();
    if (!form.valid) { return; }
    this.blockUI.start();
    this.productsService.create$(this.product).subscribe(
      (product: Product) => this.router.navigate([`/products/details/${product.id}`]).finally(
        () => this.blockUI.stop),
      (errors: Array<string>) => this.errors = errors,
      () => this.blockUI.stop());
  }

  showCreate$ = (): Observable<boolean> => this.accountService.userHasRole$('Admin');
}
