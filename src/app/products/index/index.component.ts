import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  GridDataResult,
  PagerSettings,
  SortSettings
} from '@progress/kendo-angular-grid';
import {
  AggregateDescriptor,
  DataSourceRequestState,
  SortDescriptor
} from '@progress/kendo-data-query';
import { AccountService } from '../../account/account.service';
import { ProductsService } from '../products.service';

@Component({
  selector: 'app-products-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {

  errors: Array<string>;
  products: GridDataResult;
  showAdd: boolean;
  state: DataSourceRequestState;
  pageable: PagerSettings;
  sortable: SortSettings;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly accountService: AccountService,
    private readonly productsService: ProductsService) {
    this.state = {
      skip: 0,
      take: 5,
      sort: new Array<SortDescriptor>({
        field: 'name',
        dir: 'asc'
      }),
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
    this.products = this.route.snapshot.data['products'] as GridDataResult;
    this.accountService
      .userHasRole('Admin')
      .subscribe((response: boolean) => this.showAdd = response);
  }

  dataStateChange(state: DataSourceRequestState): void {
    this.state = state;
    this.productsService
      .index(state)
      .subscribe(
        (result: GridDataResult) => this.products = result,
        (errors: Array<string>) => this.errors = errors);
  }
}
