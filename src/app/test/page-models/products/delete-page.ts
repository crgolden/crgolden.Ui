import { ComponentFixture } from '@angular/core/testing';
import { DeleteComponent } from '../../../products/delete/delete.component';
import { QueryHelpers } from '../../helpers/query-helpers';

export class DeletePage {

  fixture: ComponentFixture<DeleteComponent>;

  constructor(fixture: ComponentFixture<DeleteComponent>) {
    this.fixture = fixture;
  }

  get name() {
    let name = QueryHelpers.query<HTMLDivElement>(this.fixture, '#name').textContent;
    if (typeof name === 'string') {
      name = name.trim();
    }
    return name;
  }
}
