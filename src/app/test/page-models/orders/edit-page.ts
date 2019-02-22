import { ComponentFixture } from '@angular/core/testing';
import { EditComponent } from '../../../orders/edit/edit.component';
import { QueryHelpers } from '../../helpers/query-helpers';

export class EditPage {

  inputs: Array<HTMLInputElement>;

  constructor(fixture: ComponentFixture<EditComponent>) {
    this.inputs = QueryHelpers.queryAll<HTMLInputElement>(fixture, 'input');
  }

  get streetAddress(): HTMLInputElement {
    return this.inputs[0];
  }

  get city(): HTMLInputElement {
    return this.inputs[1];
  }

  get region(): HTMLInputElement {
    return this.inputs[2];
  }

  get postalCode(): HTMLInputElement {
    return this.inputs[3];
  }

  get country(): HTMLInputElement {
    return this.inputs[4];
  }
}
