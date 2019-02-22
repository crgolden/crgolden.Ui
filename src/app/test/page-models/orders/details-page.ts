import { ComponentFixture } from '@angular/core/testing';
import { DetailsComponent } from '../../../orders/details/details.component';
import { QueryHelpers } from '../../helpers/query-helpers';

export class DetailsPage {

  fixture: ComponentFixture<DetailsComponent>;

  constructor(fixture: ComponentFixture<DetailsComponent>) {
    this.fixture = fixture;
  }

  get number(): HTMLElement {
    return QueryHelpers.query<HTMLElement>(this.fixture, '#number');
  }

  get total(): HTMLElement {
    return QueryHelpers.query<HTMLElement>(this.fixture, '#total');
  }

  get created(): HTMLElement {
    return QueryHelpers.query<HTMLElement>(this.fixture, '#created');
  }
}
