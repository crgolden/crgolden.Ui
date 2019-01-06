import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Payment } from './payment';
import { BaseModelService } from '../base/base-model.service';

@Injectable()
export class PaymentsService extends BaseModelService<Payment> {

  constructor(protected readonly http: HttpClient) {
    super('payments', http);
  }
}
