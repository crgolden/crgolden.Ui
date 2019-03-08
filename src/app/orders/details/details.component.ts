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
import { DataSourceRequestState } from '@progress/kendo-data-query';
import { AccountService } from '../../account/account.service';
import { OrderProductsService } from '../../order-products/order-products.service';
import { PaymentsService } from '../../payments/payments.service';
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
  orderProductsState: DataSourceRequestState;
  orderProductsPageable: PagerSettings;
  orderProductsSortable: SortSettings;
  paymentsState: DataSourceRequestState;
  paymentsPageable: PagerSettings;
  paymentsSortable: SortSettings;

  constructor(
    private readonly titleService: Title,
    private readonly route: ActivatedRoute,
    private readonly toastr: ToastrService,
    private readonly accountService: AccountService,
    private readonly orderProductsService: OrderProductsService,
    private readonly paymentsService: PaymentsService) {
    this.orderProductsState = orderProductsService.state;
    this.orderProductsPageable = orderProductsService.pageable;
    this.orderProductsSortable = orderProductsService.sortable;
    this.paymentsState = paymentsService.state;
    this.paymentsPageable = paymentsService.pageable;
    this.paymentsSortable = paymentsService.sortable;
  }

  ngOnInit(): void {
    this.titleService.setTitle('Clarity: Order Details');
    this.order = this.route.snapshot.data['details'][0];
    this.orderProducts = this.route.snapshot.data['details'][1];
    this.payments = this.route.snapshot.data['details'][2];
    this.setFormattedShippingAddress();
    const message = window.sessionStorage.getItem('success');
    if (message != null) {
      window.sessionStorage.removeItem('success');
      setTimeout(() => this.toastr.success(message));
    }
  }

  orderProductsStateChange(state: DataStateChangeEvent): void {
    this.orderProductsState = this.orderProductsService.state = state;
    this.orderProductsService.index$().subscribe(
      orderProducts => this.orderProducts = orderProducts,
      (errors: string[]) => errors.forEach(error => this.toastr.error(error, null, {
        disableTimeOut: true
      })));
  }

  paymentsStateChange(state: DataStateChangeEvent): void {
    this.paymentsState = this.paymentsService.state = state;
    this.paymentsService.index$().subscribe(
      payments => this.payments = payments,
      (errors: string[]) => errors.forEach(error => this.toastr.error(error, null, {
        disableTimeOut: true
      })));
  }

  showEdit$ = (): Observable<boolean> => this.accountService.userHasRole$('Admin');

  private setFormattedShippingAddress(): void {
    if (this.order.shippingAddress == null ||
      this.order.shippingAddress.formatted == null) {
      return;
    }
    this.shippingAddress = this.order.shippingAddress;
    this.formattedShippingAddress = this.order.shippingAddress.formatted.replace(/\r\n/g, '<br />');
  }
}
