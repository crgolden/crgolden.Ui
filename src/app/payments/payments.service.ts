import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Service } from '@clarity/services';
import { environment } from '../../environments/environment';
import { Payment } from './payment';

@Injectable({
  providedIn: 'root'
})
export class PaymentsService extends Service<Payment> {

  constructor(protected readonly http: HttpClient) {
    super('payments', environment.apiUrl, http);
  }
}
