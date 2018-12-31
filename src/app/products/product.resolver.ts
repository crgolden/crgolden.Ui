import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import { Observable } from 'rxjs';
import { concatMap, take } from 'rxjs/operators';
import { AccountService } from '../account/account.service';
import { ProductsService } from './products.service';
import { Product } from './product';

@Injectable()
export class ProductResolver implements Resolve<Product> {

  constructor(
    private readonly router: Router,
    private readonly accountService: AccountService,
    private readonly productsService: ProductsService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Product> {
    const id = route.paramMap.get('id');
    return this.productsService.details$(id).pipe(
      concatMap(
        () => this.accountService.userHasRole$('Admin'),
        (product: Product, isAdmin: boolean) => {
          if (isAdmin || product.active) {
            return product;
          }
          this.router.navigate(['/AccessDenied']);
          return undefined;
        }),
      take(1));
  }
}
