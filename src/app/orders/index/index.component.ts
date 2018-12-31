import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { filter, switchMap } from 'rxjs/operators';
import {
  GridDataResult,
  PagerSettings,
  SortSettings
} from '@progress/kendo-angular-grid';
import {
  AggregateDescriptor,
  CompositeFilterDescriptor,
  DataSourceRequestState,
  FilterDescriptor,
  SortDescriptor
} from '@progress/kendo-data-query';
import { User } from 'oidc-client';
import { AccountService } from '../../account/account.service';
import { OrdersService } from '../orders.service';

@Component({
  selector: 'app-orders-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {

  errors: Array<string>;
  orders: GridDataResult;
  state: DataSourceRequestState;
  pageable: PagerSettings;
  sortable: SortSettings;

  constructor(
    private readonly titleService: Title,
    private readonly route: ActivatedRoute,
    private readonly accountService: AccountService,
    private readonly ordersService: OrdersService) {
    this.state = {
      skip: 0,
      take: 5,
      sort: new Array<SortDescriptor>({
        field: 'created',
        dir: 'desc'
      }),
      filter: {
        logic: 'and',
        filters: new Array<FilterDescriptor>()
      } as CompositeFilterDescriptor,
      aggregates: new Array<AggregateDescriptor>()
    } as DataSourceRequestState;
    this.pageable = {
      buttonCount: 1,
      type: 'numeric',
      info: false,
      previousNext: true
    } as PagerSettings;
    this.sortable = {
      allowUnsort: false,
      mode: 'single'
    } as SortSettings;
  }

  ngOnInit(): void {
    this.titleService.setTitle('Clarity: Orders');
    this.orders = this.route.snapshot.data['orders'] as GridDataResult;
    this.accountService.userHasRole$('Admin').pipe(
      filter((response: boolean) => !response),
      switchMap(() => this.accountService.user$),
      filter((user: User) => user != null)).subscribe(
        (user: User) => this.state.filter.filters.push({
          field: 'userId',
          operator: 'eq',
          value: user.profile['sub']
        } as FilterDescriptor));
  }

  dataStateChange(state: DataSourceRequestState): void {
    this.state = state;
    this.ordersService
      .index$(state)
      .subscribe(
        (result: GridDataResult) => this.orders = result,
        (errors: Array<string>) => this.errors = errors);
  }
}
