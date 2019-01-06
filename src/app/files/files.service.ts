import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseModelService } from '../base/base-model.service';
import { File } from './file';

@Injectable()
export class FilesService extends BaseModelService<File> {

  constructor(protected readonly http: HttpClient) {
    super('files', http);
  }
}
