import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
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

  constructor(
    private readonly titleService: Title,
    private readonly accountService: AccountService,
    private readonly productsService: ProductsService,
    private readonly router: Router,
    private readonly route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.titleService.setTitle('Clarity: Edit Product');
    this.product = this.route.snapshot.data['product'] as Product;
  }

  edit(form: NgForm): void {
    if (!form.valid) { return; }
    this.productsService
      .edit$(this.product)
      .subscribe(
        () => this.router.navigate([`/Products/Details/${this.product.id}`]),
        (errors: Array<string>) => this.errors = errors);
  }

  showSave$ = (): Observable<boolean> => this.accountService.userHasRole$('Admin');
}
