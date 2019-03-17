import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { combineLatest, Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { FilterDescriptor } from '@progress/kendo-data-query';
import { OrdersController } from '../orders.controller';
import { OrderProductsController } from '../../order-products/order-products.controller';
import { PaymentsController } from '../../payments/payments.controller';
import { Order } from '../order';

@Injectable({
  providedIn: 'root'
})
export class DetailsResolver implements Resolve<[
  Order,
  GridDataResult,
  GridDataResult
]> {

  constructor(
    private readonly ordersController: OrdersController,
    private readonly orderProductsController: OrderProductsController,
    private readonly paymentsController: PaymentsController) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<[
    Order,
    GridDataResult,
    GridDataResult
  ]> {
    const orderId = route.paramMap.get('orderId');
    if (orderId == null) {
      return undefined;
    }

    if (this.orderProductsController.state.filter == null) {
      this.orderProductsController.state.filter = {
        logic: 'and',
        filters: [{
          operator: 'eq',
          field: 'orderId',
          value: orderId
        }]
      };
    } else {
      const orderIdFilter = this.orderProductsController.state.filter.filters.find(
        (filter: FilterDescriptor) => filter.field === 'orderId');
      if (orderIdFilter != null) {
        (orderIdFilter as FilterDescriptor).value = orderId;
      } else {
        this.orderProductsController.state.filter.filters.push({
          operator: 'eq',
          field: 'orderId',
          value: orderId
        });
      }
    }

    if (this.paymentsController.state.filter == null) {
      this.paymentsController.state.filter = {
        logic: 'and',
        filters: [{
          operator: 'eq',
          field: 'orderId',
          value: orderId
        }]
      };
    } else {
      const orderIdFilter = this.paymentsController.state.filter.filters.find(
        (filter: FilterDescriptor) => filter.field === 'orderId');
      if (orderIdFilter != null) {
        (orderIdFilter as FilterDescriptor).value = orderId;
      } else {
        this.paymentsController.state.filter.filters.push({
          operator: 'eq',
          field: 'orderId',
          value: orderId
        });
      }
    }

    return combineLatest(
      this.ordersController.read$([orderId]),
      this.orderProductsController.list$(),
      this.paymentsController.list$())
      .pipe(take(1));
  }
}
