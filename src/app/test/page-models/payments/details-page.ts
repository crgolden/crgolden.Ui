import { ComponentFixture } from '@angular/core/testing';
import { DetailsComponent } from '../../../payments/details/details.component';
import { QueryHelpers } from '../../helpers/query-helpers';

export class DetailsPage {

  fixture: ComponentFixture<DetailsComponent>;

  constructor(fixture: ComponentFixture<DetailsComponent>) {
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
