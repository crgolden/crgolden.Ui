import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountService } from '../../account/account.service';
import { ProductsService } from '../products.service';
import { Product } from '../product';

@Component({
  selector: 'app-products-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {

  errors: Array<string>;
  product: Product;
  showCreate: boolean;

  constructor(
    private readonly accountService: AccountService,
    private readonly productsService: ProductsService,
    private readonly router: Router) {
    this.product = new Product();
  }

  ngOnInit(): void {
    this.accountService.userHasRole('Admin').subscribe((response: boolean) => {
      this.showCreate = response;
    });
  }

  create(form: NgForm): void {
    if (!form.valid) { return; }
    this.productsService
      .create(this.product)
      .subscribe(
        (product: Product) => this.router.navigate([`/Products/Details/${product.id}`]),
        (errors: Array<string>) => this.errors = errors);
  }
}
