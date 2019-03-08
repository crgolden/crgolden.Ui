import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { PaymentsService } from '../payments.service';
import { Payment } from '../payment';

@Injectable({
  providedIn: 'root'
})
export class EditResolver implements Resolve<Payment> {

  constructor(private readonly paymentsService: PaymentsService) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<Payment> {
    const paymentId = route.paramMap.get('paymentId');
    if (paymentId == null) {
      return undefined;
    }

    return this.paymentsService.details$([paymentId]);
  }
}
