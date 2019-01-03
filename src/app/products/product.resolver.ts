import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import { combineLatest, Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
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
    return combineLatest(
      this.accountService.userHasRole$('Admin'),
      this.productsService.details$(id)).pipe(
      take(1),
      map((latest: [boolean, Product]) => {
        const [isAdmin, product] = latest;
        if (isAdmin || product.active) {
          return product;
        }
        this.router.navigate(['/AccessDenied']);
        return undefined;
      }));
  }
}
