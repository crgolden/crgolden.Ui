import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { PaymentsController } from '../payments.controller';
import { Payment } from '../payment';

@Injectable({
  providedIn: 'root'
})
export class DetailsResolver implements Resolve<Payment> {

  constructor(private readonly paymentsController: PaymentsController) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<Payment> {
    const paymentId = route.paramMap.get('paymentId');
    if (paymentId == null) {
      return undefined;
    }

    return this.paymentsController.read$([paymentId]);
  }
}
