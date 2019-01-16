import { ComponentFixture } from '@angular/core/testing';
import { DetailsComponent } from '../../../payments/details/details.component';
import { QueryHelpers } from '../../helpers/query-helpers';

export class DetailsPage {

  fixture: ComponentFixture<DetailsComponent>;

  constructor(fixture: ComponentFixture<DetailsComponent>) {
    this.fixture = fixture;
  }

  get name(): HTMLElement {
    return QueryHelpers.query<HTMLElement>(this.fixture, '#name');
  }

  get amount(): HTMLElement {
    return QueryHelpers.query<HTMLElement>(this.fixture, '#amount');
  }

  get description(): HTMLElement {
    return QueryHelpers.query<HTMLElement>(this.fixture, '#description');
  }
}
