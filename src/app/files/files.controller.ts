import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ModelController } from '@crgolden/core-controllers';
import { environment } from '../../environments/environment';
import { File } from './file';

@Injectable({
  providedIn: 'root'
})
export class FilesService extends ModelController<File> {

  constructor(http: HttpClient) {
    super('files', environment.apiUrl, http);
  }
}
