import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../../account/account.service';
import { ProductsController } from '../products.controller';
import { Product } from '../product';

@Component({
  selector: 'app-products-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {

  product: Product;

  constructor(
    private readonly titleService: Title,
    private readonly router: Router,
    private readonly toastr: ToastrService,
    private readonly accountService: AccountService,
    private readonly productsController: ProductsController) {
  }

  ngOnInit(): void {
    this.titleService.setTitle('Clarity: Create Product');
    this.product = new Product();
  }

  create(form: NgForm): void {
    if (!form.valid) { return; }
    this.productsController.create$(this.product).subscribe(
      product => {
        window.sessionStorage.setItem('success', `${this.product.name} created`);
        this.router.navigate([`/products/details/${product.id}`]);
      },
      (errors: string[]) => errors.forEach(error => this.toastr.error(error, null, {
        disableTimeOut: true
      })));
  }

  showCreate$ = (): Observable<boolean> => this.accountService.userHasRole$('Admin');
}
