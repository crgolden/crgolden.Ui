import { ComponentFixture } from '@angular/core/testing';
import { CreateComponent } from '../../../products/create/create.component';
import { QueryHelpers } from '../../helpers/query-helpers';

export class CreatePage {

  inputs: Array<HTMLInputElement>;
  textAreas: Array<HTMLTextAreaElement>;

  constructor(fixture: ComponentFixture<CreateComponent>) {
    this.inputs = QueryHelpers.queryAll<HTMLInputElement>(fixture, 'input');
    this.textAreas = QueryHelpers.queryAll<HTMLTextAreaElement>(fixture, 'textarea');
  }

  get name(): HTMLInputElement {
    return this.inputs[0];
  }

  get active(): HTMLInputElement {
    return this.inputs[1];
  }

  get isDownload(): HTMLInputElement {
    return this.inputs[2];
  }

  get description(): HTMLTextAreaElement {
    return this.textAreas[0];
  }

  get unitPrice(): HTMLInputElement {
    return this.inputs[3];
  }

  get quantityPerUnit(): HTMLInputElement {
    return this.inputs[4];
  }
}
