import { ComponentFixture } from '@angular/core/testing';
import { CartComponent } from '../../../cart/cart.component';
import { QueryHelpers } from '../../helpers/query-helpers';

export class CartPage {

  rows: Array<HTMLTableRowElement>;

  constructor(fixture: ComponentFixture<CartComponent>) {
    this.rows = QueryHelpers.queryAll<HTMLTableRowElement>(fixture, 'tr');
  }
}
