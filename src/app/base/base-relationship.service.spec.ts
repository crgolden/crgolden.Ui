import { } from 'jasmine';
import { defer } from 'rxjs/index';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { BaseRelationshipService } from './base-relationship.service';
import { BaseRelationship } from './base-relationship';

class RelationshipService extends BaseRelationshipService<BaseRelationship> {
  constructor(http: any) {
    super('', http);
  }
}

let httpBaseRelationshipSpy: any;
let relationshipService: RelationshipService;
let relationship1: BaseRelationship;

describe('BaseRelationshipService', () => {

  beforeEach(() => {
    httpBaseRelationshipSpy = jasmine.createSpyObj('HttpClient', ['get', 'post', 'put', 'delete']);
    relationshipService = new RelationshipService(httpBaseRelationshipSpy as any);
    relationship1 = {
      model1Id: '1',
      model1Name: 'Model 1',
      model2Id: '2',
      model2Name: 'Model 2'
    } as BaseRelationship;
  });

  it('index should return a list of relationships', () => {
    const relationship2 = {
      model1Id: '1',
      model1Name: 'Model 1',
      model2Id: '2',
      model2Name: 'Model 2'
    } as BaseRelationship;
    const relationships = [relationship1, relationship2];
    const relationshipsGridDataResult = {
      data: relationships,
      total: relationships.length
    } as GridDataResult;

    httpBaseRelationshipSpy.get.and.returnValue(defer(() => Promise.resolve(relationshipsGridDataResult)));

    relationshipService
      .index({})
      .subscribe((result: GridDataResult) => expect(result).toEqual(relationshipsGridDataResult, 'expected relationships'));

    expect(httpBaseRelationshipSpy.get.calls.count()).toBe(1, 'one call');
  });

  it('details should return a relationship', () => {
    httpBaseRelationshipSpy.get.and.returnValue(defer(() => Promise.resolve(relationship1)));

    relationshipService
      .details(relationship1.model1Id, relationship1.model2Id)
      .subscribe((result: BaseRelationship) => expect(result).toEqual(relationship1, 'expected relationship1'));

    expect(httpBaseRelationshipSpy.get.calls.count()).toBe(1, 'one call');
  });

  it('create should return a relationship', () => {
    httpBaseRelationshipSpy.post.and.returnValue(defer(() => Promise.resolve(relationship1)));

    relationshipService
      .create(relationship1)
      .subscribe((result: BaseRelationship) => expect(result).toEqual(relationship1, 'expected relationship1'));

    expect(httpBaseRelationshipSpy.post.calls.count()).toBe(1, 'one call');
  });

  it('edit should not return anything', () => {
    httpBaseRelationshipSpy.put.and.returnValue(defer(() => Promise.resolve()));

    relationshipService
      .edit(relationship1)
      .subscribe((result: Object) => expect(result).toBeUndefined('expected undefined'));

    expect(httpBaseRelationshipSpy.put.calls.count()).toBe(1, 'one call');
  });

  it('delete should not return anything', () => {
    httpBaseRelationshipSpy.delete.and.returnValue(defer(() => Promise.resolve()));

    relationshipService
      .delete(relationship1.model1Id, relationship1.model2Id)
      .subscribe((result: Object) => expect(result).toBeUndefined('expected undefined'));

    expect(httpBaseRelationshipSpy.delete.calls.count()).toBe(1, 'one call');
  });

});
