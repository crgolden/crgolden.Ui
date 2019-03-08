import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { OrdersService } from '../orders.service';

@Injectable({
  providedIn: 'root'
})
export class IndexResolver implements Resolve<GridDataResult> {

  constructor(private readonly ordersService: OrdersService) {
  }

  resolve(): Observable<GridDataResult> {
    return this.ordersService.index$();
  }
}
