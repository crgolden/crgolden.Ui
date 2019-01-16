import { ComponentFixture } from '@angular/core/testing';
import { IndexComponent } from '../../../orders/index/index.component';
import { QueryHelpers } from '../../helpers/query-helpers';

export class IndexPage {

  rows: Array<HTMLTableRowElement>;

  constructor(fixture: ComponentFixture<IndexComponent>) {
    this.rows = QueryHelpers.queryAll<HTMLTableRowElement>(fixture, 'tr');
  }
}
