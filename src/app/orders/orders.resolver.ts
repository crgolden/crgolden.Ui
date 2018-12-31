import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { Observable } from 'rxjs';
import { concatMap, mergeMap, take } from 'rxjs/operators';
import { GridDataResult } from '@progress/kendo-angular-grid';
import {
  AggregateDescriptor,
  CompositeFilterDescriptor,
  DataSourceRequestState,
  FilterDescriptor,
  SortDescriptor
} from '@progress/kendo-data-query';
import { User } from 'oidc-client';
import { AccountService } from '../account/account.service';
import { OrdersService } from './orders.service';

@Injectable()
export class OrdersResolver implements Resolve<GridDataResult> {

  constructor(
    private readonly accountService: AccountService,
    private readonly ordersService: OrdersService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<GridDataResult> {
    return this.accountService.userHasRole$('Admin').pipe(
      mergeMap(
        () => this.accountService.user$,
        (response: boolean, user: User) => {
          const requestState: DataSourceRequestState = {
            skip: 0,
            take: 5,
            sort: new Array<SortDescriptor>({
              field: 'created',
              dir: 'desc'
            } as SortDescriptor),
            filter: {
              logic: 'and',
              filters: new Array<FilterDescriptor>()
            } as CompositeFilterDescriptor,
            aggregates: new Array<AggregateDescriptor>()
          };
          if (!response) {
            requestState.filter.filters.push({
              field: 'userId',
              operator: 'eq',
              value: user.profile['sub']
            } as FilterDescriptor);
          }
          return requestState;
        }),
      concatMap((requestState: DataSourceRequestState) => this.ordersService.index$(requestState)),
      take(1));
  }
}
