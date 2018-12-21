import { HttpClient } from '@angular/common/http';
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

  index(state: DataSourceRequestState): Observable<GridDataResult> {
    const hasGroups = state.group && state.group.length > 0;
    const queryStr = `${toDataSourceRequestString(state)}`;

    return this.http
      .get<GridDataResult>(`${environment.apiUrl}/${this.controllerName}/Index?${queryStr}`)
      .pipe(
        map((res: GridDataResult) => ({
          data: hasGroups ? translateDataSourceResultGroups(res.data) : res.data,
          total: res.total
        })));
  }

  details(id1: string, id2: string): Observable<T> {
    return this.http
      .get<T>(`${environment.apiUrl}/${this.controllerName}/Details/${id1}/${id2}`);
  }

  create(relationship: T): Observable<T> {
    return this.http
      .post<T>(`${environment.apiUrl}/${this.controllerName}/Create`, JSON.stringify(relationship));
  }

  edit(relationship: T): Observable<Object> {
    return this.http
      .put(`${environment.apiUrl}/${this.controllerName}/Edit/${relationship.model1Id}/${relationship.model2Id}`, JSON.stringify(relationship));
  }

  delete(id1: string, id2: string): Observable<Object> {
    return this.http
      .delete(`${environment.apiUrl}/${this.controllerName}/Delete/${id1}/${id2}`);
  }
}
