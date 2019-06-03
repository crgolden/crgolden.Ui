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
import { Address } from '@crgolden/core-claims';
import { AccountService } from '../../account/account.service';
import { OrderProductsController } from '../../order-products/order-products.controller';
import { PaymentsController } from '../../payments/payments.controller';
import { Order } from '../order';

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
    private readonly orderProductsController: OrderProductsController,
    private readonly paymentsController: PaymentsController) {
    this.orderProductsState = orderProductsController.state;
    this.orderProductsPageable = orderProductsController.pageable;
    this.orderProductsSortable = orderProductsController.sortable;
    this.paymentsState = paymentsController.state;
    this.paymentsPageable = paymentsController.pageable;
    this.paymentsSortable = paymentsController.sortable;
  }

  ngOnInit(): void {
    this.titleService.setTitle('crgolden: Order Details');
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
    this.orderProductsState = this.orderProductsController.state = state;
    this.orderProductsController.list$().subscribe(
      orderProducts => this.orderProducts = orderProducts,
      (errors: string[]) => errors.forEach(error => this.toastr.error(error, null, {
        disableTimeOut: true
      })));
  }

  paymentsStateChange(state: DataStateChangeEvent): void {
    this.paymentsState = this.paymentsController.state = state;
    this.paymentsController.list$().subscribe(
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
