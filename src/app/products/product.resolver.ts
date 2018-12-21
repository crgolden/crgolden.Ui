import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { ProductsService } from './products.service';
import { Product } from './product';

@Injectable()
export class ProductResolver implements Resolve<Product> {

  constructor(private readonly productsService: ProductsService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Product> {
    const id = route.paramMap.get('id');
    return this.productsService.details(id).pipe(
      take(1),
      map((product: Product) => product)
    );
  }
}
