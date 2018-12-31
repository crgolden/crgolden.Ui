import { ComponentFixture } from '@angular/core/testing';
import { IndexComponent } from '../../../orders/index/index.component';
import { QueryHelpers } from '../../helpers/query-helpers';

export class IndexPage {

  fixture: ComponentFixture<IndexComponent>;

  constructor(fixture: ComponentFixture<IndexComponent>) {
    this.fixture = fixture;
  }

  get rows() {
    return QueryHelpers.queryAll<HTMLElement>(this.fixture, 'tr');
  }
}
