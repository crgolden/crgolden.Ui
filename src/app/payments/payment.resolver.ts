import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { PaymentsService } from './payments.service';
import { Payment } from './payment';

@Injectable()
export class PaymentResolver implements Resolve<Payment> {

  constructor(private readonly paymentsService: PaymentsService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Payment> {
    const id = route.paramMap.get('id');
    return this.paymentsService.details$(new Array<string>(id)).pipe(
      take(1),
      map((payment: Payment) => payment)
    );
  }
}
