import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { OrdersController } from '../orders.controller';

@Injectable({
  providedIn: 'root'
})
export class IndexResolver implements Resolve<GridDataResult> {

  constructor(private readonly ordersController: OrdersController) {
  }

  resolve(): Observable<GridDataResult> {
    return this.ordersController.list$();
  }
}
