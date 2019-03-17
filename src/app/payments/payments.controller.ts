import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ModelController } from '@clarity/core-controllers';
import { environment } from '../../environments/environment';
import { Payment } from './payment';

@Injectable({
  providedIn: 'root'
})
export class PaymentsController extends ModelController<Payment> {

  constructor(http: HttpClient) {
    super('payments', environment.apiUrl, http);
  }
}
