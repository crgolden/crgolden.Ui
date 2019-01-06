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
import { BaseRelationship } from './base-relationship';

export abstract class BaseRelationshipService<T extends BaseRelationship> {

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
      .get<GridDataResult>(`${environment.apiUrl}/${this.controllerName}/index?${queryStr}`)
      .pipe(map((res: GridDataResult) => ({
        data: hasGroups ? translateDataSourceResultGroups(res.data) : res.data,
        total: res.total
      })));
  }

  details$(id1: string, id2: string): Observable<T> {
    return this.http
      .get<T>(`${environment.apiUrl}/${this.controllerName}/details/${id1}/${id2}`);
  }

  create$(relationship: T): Observable<T> {
    return this.http
      .post<T>(`${environment.apiUrl}/${this.controllerName}/create`, JSON.stringify(relationship), {
        headers: this.headers
      });
  }

  createRange$(relationships: Array<T>): Observable<Array<T>> {
    return this.http
      .post<Array<T>>(`${environment.apiUrl}/${this.controllerName}/create-range`, JSON.stringify(relationships), {
        headers: this.headers
      });
  }

  edit$(relationship: T): Observable<Object> {
    return this.http
      /* tslint:disable-next-line:max-line-length */
      .put(`${environment.apiUrl}/${this.controllerName}/edit/${relationship.model1Id}/${relationship.model2Id}`, JSON.stringify(relationship), {
        headers: this.headers
      });
  }

  editRange$(relationships: Array<T>): Observable<Object> {
    return this.http
      /* tslint:disable-next-line:max-line-length */
      .put(`${environment.apiUrl}/${this.controllerName}/edit-range`, JSON.stringify(relationships), {
        headers: this.headers
      });
  }

  delete$(id1: string, id2: string): Observable<Object> {
    return this.http
      .delete(`${environment.apiUrl}/${this.controllerName}/delete/${id1}/${id2}`);
  }
}
