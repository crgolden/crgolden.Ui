import { ComponentFixture } from '@angular/core/testing';
import { EditComponent } from '../../../payments/edit/edit.component';
import { QueryHelpers } from '../../helpers/query-helpers';

export class EditPage {

  textareas: Array<HTMLTextAreaElement>;
  fixture: ComponentFixture<EditComponent>;

  constructor(fixture: ComponentFixture<EditComponent>) {
    this.fixture = fixture;
    this.textareas = QueryHelpers.queryAll<HTMLTextAreaElement>(fixture, 'textarea');
  }

  get name(): HTMLElement {
    return QueryHelpers.query<HTMLElement>(this.fixture, '#name');
  }

  get amount(): HTMLElement {
    return QueryHelpers.query<HTMLElement>(this.fixture, '#amount');
  }

  get description(): HTMLTextAreaElement {
    return this.textareas[0];
  }
}
