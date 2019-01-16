import { ComponentFixture } from '@angular/core/testing';
import { CreateComponent } from '../../../checkout/create/create.component';
import { QueryHelpers } from '../../helpers/query-helpers';

export class CreatePage {
  constructor(fixture: ComponentFixture<CreateComponent>) {
    this.fixture = fixture;
  }

  fixture: ComponentFixture<CreateComponent>;

  get inputs() {
    return QueryHelpers.queryAll<HTMLInputElement>(this.fixture, 'input');
  }
}
