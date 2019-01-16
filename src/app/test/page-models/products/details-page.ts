import { ComponentFixture } from '@angular/core/testing';
import { DetailsComponent } from '../../../products/details/details.component';
import { QueryHelpers } from '../../helpers/query-helpers';

export class DetailsPage {

  fixture: ComponentFixture<DetailsComponent>;

  constructor(fixture: ComponentFixture<DetailsComponent>) {
    this.fixture = fixture;
  }

  get name(): HTMLElement {
    return QueryHelpers.query<HTMLElement>(this.fixture, '#name');
  }

  get description(): HTMLElement {
    return QueryHelpers.query<HTMLElement>(this.fixture, '#description');
  }

  get unitPrice(): HTMLElement {
    return QueryHelpers.query<HTMLElement>(this.fixture, '#unitPrice');
  }

  get quantityPerUnit(): HTMLElement {
    return QueryHelpers.query<HTMLElement>(this.fixture, '#quantityPerUnit');
  }
}
