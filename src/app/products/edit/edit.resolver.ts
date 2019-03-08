import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { combineLatest, Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { FilterDescriptor } from '@progress/kendo-data-query';
import { ProductFilesService } from '../../product-files/product-files.service';
import { ProductsService } from '../products.service';
import { Product } from '../product';

@Injectable({
  providedIn: 'root'
})
export class EditResolver implements Resolve<[
  GridDataResult,
  Product
]> {

  constructor(
    private readonly productFilesService: ProductFilesService,
    private readonly productsService: ProductsService) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<[
    GridDataResult,
    Product
  ]> {
    const productId = route.paramMap.get('productId');
    if (productId == null) {
      return undefined;
    }

    const state = this.productFilesService.state;
    this.productFilesService.state.take = undefined;
    if (this.productFilesService.state.filter == null) {
      this.productFilesService.state.filter = {
        logic: 'and',
        filters: [{
          operator: 'eq',
          field: 'productId',
          value: productId
        }]
      };
    } else {
      const productIdFilter = this.productFilesService.state.filter.filters.find(
        (filter: FilterDescriptor) => filter.field === 'productId');
      if (productIdFilter != null) {
        (productIdFilter as FilterDescriptor).value = productId;
      } else {
        this.productFilesService.state.filter.filters.push({
          operator: 'eq',
          field: 'productId',
          value: productId
        });
      }
    }
    return combineLatest(
      this.productFilesService.index$()
        .pipe(map(productFiles => {
          this.productFilesService.state = state;
          return productFiles;
        })),
      this.productsService.details$([productId]))
      .pipe(take(1));
  }
}
