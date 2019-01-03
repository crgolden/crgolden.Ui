import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { Observable } from 'rxjs';
import { concatMap, take } from 'rxjs/operators';
import { GridDataResult } from '@progress/kendo-angular-grid';
import {
  AggregateDescriptor,
  CompositeFilterDescriptor,
  DataSourceRequestState,
  FilterDescriptor,
  SortDescriptor
} from '@progress/kendo-data-query';
import { AccountService } from '../account/account.service';
import { ProductsService } from './products.service';

@Injectable()
export class ProductsResolver implements Resolve<GridDataResult> {

  constructor(
    private readonly accountService: AccountService,
    private readonly productsService: ProductsService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<GridDataResult> {
    return this.accountService.userHasRole$('Admin').pipe(
      concatMap(
        (isAdmin: boolean) => {
          const requestState: DataSourceRequestState = {
            skip: 0,
            take: 5,
            sort: new Array<SortDescriptor>({
              field: 'name',
              dir: 'asc'
            } as SortDescriptor),
            filter: {
              logic: 'and',
              filters: new Array<FilterDescriptor>()
            } as CompositeFilterDescriptor,
            aggregates: new Array<AggregateDescriptor>()
          };
          if (!isAdmin) {
            requestState.filter.filters.push({
              field: 'active',
              operator: 'eq',
              value: true
            } as FilterDescriptor);
          }
          return this.productsService.index$(requestState);
        }),
      take(1));
  }
}
