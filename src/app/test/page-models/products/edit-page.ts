import { ComponentFixture } from '@angular/core/testing';
import { EditComponent } from '../../../products/edit/edit.component';
import { QueryHelpers } from '../../helpers/query-helpers';

export class EditPage {

  inputs: Array<HTMLInputElement>;
  textareas: Array<HTMLTextAreaElement>;

  constructor(fixture: ComponentFixture<EditComponent>) {
    this.inputs = QueryHelpers.queryAll<HTMLInputElement>(fixture, 'input');
    this.textareas = QueryHelpers.queryAll<HTMLTextAreaElement>(fixture, 'textarea');
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
    return this.textareas[0];
  }

  get unitPrice(): HTMLInputElement {
    return this.inputs[3];
  }

  get quantityPerUnit(): HTMLInputElement {
    return this.inputs[4];
  }
}
