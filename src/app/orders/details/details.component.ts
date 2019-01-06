import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import {
  DataStateChangeEvent,
  PagerSettings,
  SortSettings,
  GridDataResult
} from '@progress/kendo-angular-grid';
import {
  AggregateDescriptor,
  SortDescriptor,
  State,
  process
} from '@progress/kendo-data-query';
import { AccountService } from '../../account/account.service';
import { Order } from '../order';
import { Address } from '../../address/address';

@Component({
  selector: 'app-orders-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {

  order: Order;
  orderProducts: GridDataResult;
  payments: GridDataResult;
  shippingAddress: Address;
  formattedShippingAddress: string;
  orderProductsState: State;
  paymentsState: State;
  pageable: PagerSettings;
  sortable: SortSettings;

  constructor(
    private readonly titleService: Title,
    private readonly route: ActivatedRoute,
    private readonly toastr: ToastrService,
    private readonly accountService: AccountService) {
    this.orderProductsState = {
      skip: 0,
      take: 5,
      sort: new Array<SortDescriptor>({
        field: 'model2Name',
        dir: 'asc'
      }),
      aggregates: new Array<AggregateDescriptor>()
    } as State;
    this.paymentsState = {
      skip: 0,
      take: 5,
      sort: new Array<SortDescriptor>({
        field: 'created',
        dir: 'desc'
      }),
      aggregates: new Array<AggregateDescriptor>()
    } as State;
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
    this.titleService.setTitle('Clarity: Order Details');
    this.order = this.route.snapshot.data['order'] as Order;
    this.orderProducts = process(this.order.orderProducts, this.orderProductsState);
    this.payments = process(this.order.payments, this.paymentsState);
    this.setFormattedShippingAddress();
    const message = window.sessionStorage.getItem('success');
    if (message != null) {
      window.sessionStorage.removeItem('success');
      setTimeout(() => this.toastr.success(message));
    }
  }

  orderProductsStateChange(state: DataStateChangeEvent): void {
    this.orderProductsState = state;
    this.orderProducts = process(this.order.orderProducts, this.orderProductsState);
  }

  paymentsStateChange(state: DataStateChangeEvent): void {
    this.paymentsState = state;
    this.payments = process(this.order.payments, this.paymentsState);
  }

  showEdit$ = (): Observable<boolean> => this.accountService.userHasRole$('Admin');

  private setFormattedShippingAddress(): void {
    const address = JSON.parse(this.order.shippingAddress) as Address;
    if (address.formatted == null) {
      return;
    }
    this.shippingAddress = address;
    this.formattedShippingAddress = address.formatted.replace(/\r\n/g, '<br />');
  }
}
