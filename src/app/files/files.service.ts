import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Service } from '@clarity/services';
import { environment } from '../../environments/environment';
import { File } from './file';

@Injectable({
  providedIn: 'root'
})
export class FilesService extends Service<File> {

  constructor(http: HttpClient) {
    super('files', environment.apiUrl, http);
  }
}
