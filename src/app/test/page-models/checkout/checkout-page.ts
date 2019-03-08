import { ComponentFixture } from '@angular/core/testing';
import { CheckoutComponent } from '../../../checkout/checkout.component';
import { QueryHelpers } from '../../helpers/query-helpers';

export class CreatePage {
  constructor(fixture: ComponentFixture<CheckoutComponent>) {
    this.fixture = fixture;
  }

  fixture: ComponentFixture<CheckoutComponent>;

  get inputs() {
    return QueryHelpers.queryAll<HTMLInputElement>(this.fixture, 'input');
  }
}
