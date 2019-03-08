import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { combineLatest, Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { FilterDescriptor } from '@progress/kendo-data-query';
import { OrdersService } from '../orders.service';
import { OrderProductsService } from '../../order-products/order-products.service';
import { PaymentsService } from '../../payments/payments.service';
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
    private readonly ordersService: OrdersService,
    private readonly orderProductsService: OrderProductsService,
    private readonly paymentsService: PaymentsService) {
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

    if (this.orderProductsService.state.filter == null) {
      this.orderProductsService.state.filter = {
        logic: 'and',
        filters: [{
          operator: 'eq',
          field: 'orderId',
          value: orderId
        }]
      }
    } else {
      const orderIdFilter = this.orderProductsService.state.filter.filters.find(
        (filter: FilterDescriptor) => filter.field === 'orderId');
      if (orderIdFilter != null) {
        (orderIdFilter as FilterDescriptor).value = orderId;
      } else {
        this.orderProductsService.state.filter.filters.push({
          operator: 'eq',
          field: 'orderId',
          value: orderId
        });
      }
    }

    return combineLatest(
      this.ordersService.details$([orderId]),
      this.orderProductsService.index$(),
      this.paymentsService.index$())
      .pipe(take(1));
  }
}