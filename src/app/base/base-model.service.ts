import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/index';
import { map } from 'rxjs/operators/index';
import {
  toDataSourceRequestString,
  translateDataSourceResultGroups,
  DataSourceRequestState
} from '@progress/kendo-data-query';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { environment } from '../../environments/environment';
import { BaseModel } from './base-model';

export abstract class BaseModelService<T extends BaseModel> {

  controllerName: string;

  protected constructor(
    controllerName: string,
    protected readonly http: HttpClient) {
    this.controllerName = controllerName;
  }

  protected get headers(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json'
    });
  }

  index$(state: DataSourceRequestState): Observable<GridDataResult> {
    const hasGroups = state.group && state.group.length > 0;
    const queryStr = toDataSourceRequestString(state);

    return this.http
      .get<GridDataResult>(`${environment.apiUrl}/${this.controllerName}/Index?${queryStr}`)
      .pipe(map((res: GridDataResult) => ({
        data: hasGroups ? translateDataSourceResultGroups(res.data) : res.data,
        total: res.total
      })));
  }

  details$(id: string): Observable<T> {
    return this.http
      .get<T>(`${environment.apiUrl}/${this.controllerName}/Details/${id}`);
  }

  create$(model: T): Observable<T> {
    return this.http
      .post<T>(`${environment.apiUrl}/${this.controllerName}/Create`, JSON.stringify(model), {
        headers: this.headers
      });
  }

  createRange$(models: Array<T>): Observable<Array<T>> {
    return this.http
      .post<Array<T>>(`${environment.apiUrl}/${this.controllerName}/CreateRange`, JSON.stringify(models), {
        headers: this.headers
      });
  }

  edit$(model: T): Observable<Object> {
    return this.http
      .put(`${environment.apiUrl}/${this.controllerName}/Edit/${model.id}`, JSON.stringify(model), {
        headers: this.headers
      });
  }

  editRange$(models: Array<T>): Observable<Object> {
    return this.http
      .put(`${environment.apiUrl}/${this.controllerName}/EditRange`, JSON.stringify(models), {
        headers: this.headers
      });
  }

  delete$(id: string): Observable<Object> {
    return this.http
      .delete(`${environment.apiUrl}/${this.controllerName}/Delete/${id}`);
  }
}
