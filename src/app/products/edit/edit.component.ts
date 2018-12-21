import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AccountService } from '../../account/account.service';
import { ProductsService } from '../products.service';
import { Product } from '../product';

@Component({
  selector: 'app-products-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {

  errors: Array<string>;
  product: Product;
  showSave: boolean;

  constructor(
    private readonly accountService: AccountService,
    private readonly productsService: ProductsService,
    private readonly router: Router,
    private readonly route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.product = this.route.snapshot.data['product'] as Product;
    this.accountService.userHasRole('Admin').subscribe((response: boolean) => {
      this.showSave = response;
    });
  }

  edit(form: NgForm): void {
    if (!form.valid) { return; }
    this.productsService
      .edit(this.product)
      .subscribe(
        () => this.router.navigate([`/Products/Details/${this.product.id}`]),
        (errors: Array<string>) => this.errors = errors);
  }
}
