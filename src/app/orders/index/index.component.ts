import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import {
  GridDataResult,
  PagerSettings,
  SortSettings
} from '@progress/kendo-angular-grid';
import { DataSourceRequestState } from '@progress/kendo-data-query';
import { OrdersController } from '../orders.controller';

@Component({
  selector: 'app-orders-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {

  orders: GridDataResult;
  state: DataSourceRequestState;
  pageable: PagerSettings;
  sortable: SortSettings;

  constructor(
    private readonly titleService: Title,
    private readonly route: ActivatedRoute,
    private readonly toastr: ToastrService,
    private readonly ordersController: OrdersController) {
    this.state = ordersController.state;
    this.pageable = ordersController.pageable;
    this.sortable = ordersController.sortable;
  }

  ngOnInit(): void {
    this.titleService.setTitle('crgolden: Orders');
    this.orders = this.route.snapshot.data['orders'] as GridDataResult;
  }

  dataStateChange(state: DataSourceRequestState): void {
    this.state = this.ordersController.state = state;
    this.ordersController.list$().subscribe(
      result => this.orders = result,
      (errors: string[]) => errors.forEach(error => this.toastr.error(error, null, {
        disableTimeOut: true
      })));
  }
}
