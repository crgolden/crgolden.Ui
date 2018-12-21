import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AccountService } from '../../account/account.service';
import { ProductsService } from '../products.service';
import { Product } from '../product';

@Component({
  selector: 'app-products-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.scss']
})
export class DeleteComponent implements OnInit {

  errors: Array<string>;
  product: Product;
  showDelete: boolean;

  constructor(
    private readonly accountService: AccountService,
    private readonly productsService: ProductsService,
    private readonly router: Router,
    private readonly route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.product = this.route.snapshot.data['product'] as Product;
    this.accountService.userHasRole('Admin').subscribe((response: boolean) => {
      this.showDelete = response;
    });
  }

  delete(): void {
    this.productsService
      .delete(this.product.id)
      .subscribe(
        () => this.router.navigate(['/Products']),
        (errors: Array<string>) => this.errors = errors);
  }
}
