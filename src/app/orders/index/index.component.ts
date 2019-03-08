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
import { OrdersService } from '../orders.service';

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
    private readonly ordersService: OrdersService) {
    this.state = ordersService.state;
    this.pageable = ordersService.pageable;
    this.sortable = ordersService.sortable;
  }

  ngOnInit(): void {
    this.titleService.setTitle('Clarity: Orders');
    this.orders = this.route.snapshot.data['orders'] as GridDataResult;
  }

  dataStateChange(state: DataSourceRequestState): void {
    this.state = this.ordersService.state = state;
    this.ordersService.index$().subscribe(
      result => this.orders = result,
      (errors: string[]) => errors.forEach(error => this.toastr.error(error, null, {
        disableTimeOut: true
      })));
  }
}
