import { ComponentFixture } from '@angular/core/testing';
import { EditComponent } from '../../../cart/edit/edit.component';
import { QueryHelpers } from '../../helpers/query-helpers';

export class EditPage {

  rows: Array<HTMLTableRowElement>;

  constructor(fixture: ComponentFixture<EditComponent>) {
    this.rows = QueryHelpers.queryAll<HTMLTableRowElement>(fixture, 'tr');
  }
}
