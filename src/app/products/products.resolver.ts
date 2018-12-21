import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { GridDataResult } from '@progress/kendo-angular-grid';
import {
  AggregateDescriptor,
  DataSourceRequestState,
  SortDescriptor
} from '@progress/kendo-data-query';
import { ProductsService } from './products.service';

@Injectable()
export class ProductsResolver implements Resolve<GridDataResult> {

  constructor(private readonly productsService: ProductsService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<GridDataResult> {
    const sortDescriptor: SortDescriptor = {
      field: 'name',
      dir: 'asc'
    };
    const requestState: DataSourceRequestState = {
      skip: 0,
      take: 5,
      sort: new Array<SortDescriptor>(sortDescriptor),
      aggregates: new Array<AggregateDescriptor>()
    };
    return this.productsService.index(requestState).pipe(
      take(1),
      map((products: GridDataResult) => products));
  }
}
