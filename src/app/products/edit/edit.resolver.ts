import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { combineLatest, Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { FilterDescriptor } from '@progress/kendo-data-query';
import { ProductFilesController } from '../../product-files/product-files.controller';
import { ProductsController } from '../products.controller';
import { Product } from '../product';

@Injectable({
  providedIn: 'root'
})
export class EditResolver implements Resolve<[
  GridDataResult,
  Product
]> {

  constructor(
    private readonly productFilesController: ProductFilesController,
    private readonly productsController: ProductsController) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<[
    GridDataResult,
    Product
  ]> {
    const productId = route.paramMap.get('productId');
    if (productId == null) {
      return undefined;
    }

    const state = this.productFilesController.state;
    this.productFilesController.state.take = undefined;
    if (this.productFilesController.state.filter == null) {
      this.productFilesController.state.filter = {
        logic: 'and',
        filters: [{
          operator: 'eq',
          field: 'productId',
          value: productId
        }]
      };
    } else {
      const productIdFilter = this.productFilesController.state.filter.filters.find(
        (filter: FilterDescriptor) => filter.field === 'productId');
      if (productIdFilter != null) {
        (productIdFilter as FilterDescriptor).value = productId;
      } else {
        this.productFilesController.state.filter.filters.push({
          operator: 'eq',
          field: 'productId',
          value: productId
        });
      }
    }
    return combineLatest(
      this.productFilesController.list$()
        .pipe(map(productFiles => {
          this.productFilesController.state = state;
          return productFiles;
        })),
      this.productsController.read$([productId]))
      .pipe(take(1));
  }
}
