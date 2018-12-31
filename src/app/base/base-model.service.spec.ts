import { } from 'jasmine';
import { defer } from 'rxjs/index';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { BaseModelService } from './base-model.service';
import { BaseModel } from './base-model';

class ModelService extends BaseModelService<BaseModel> {
  constructor(http: any) {
    super('', http);
  }
}

let httpBaseModelSpy: any;
let modelService: ModelService;
let model1: BaseModel;

describe('BaseModelService', () => {

  beforeEach(() => {
    httpBaseModelSpy = jasmine.createSpyObj('HttpClient', ['get', 'post', 'put', 'delete']);
    modelService = new ModelService(httpBaseModelSpy as any);
    model1 = {
      id: '1',
      name: 'Model 1'
    } as BaseModel;
  });

  it('index should return a list of models', () => {
    const model2 = {
      id: '2',
      name: 'Model 2'
    } as BaseModel;
    const models = [model1, model2];
    const modelsGridDataResult = {
      data: models,
      total: models.length
    } as GridDataResult;

    httpBaseModelSpy.get.and.returnValue(defer(() => Promise.resolve(modelsGridDataResult)));

    modelService
      .index$({})
      .subscribe((result: GridDataResult) => expect(result).toEqual(modelsGridDataResult, 'expected models'));

    expect(httpBaseModelSpy.get.calls.count()).toBe(1, 'one call');
  });

  it('details should return a model', () => {
    httpBaseModelSpy.get.and.returnValue(defer(() => Promise.resolve(model1)));

    modelService
      .details$(model1.id)
      .subscribe((result: BaseModel) => expect(result).toEqual(model1, 'expected model1'));

    expect(httpBaseModelSpy.get.calls.count()).toBe(1, 'one call');
  });

  it('create should return a model', () => {
    httpBaseModelSpy.post.and.returnValue(defer(() => Promise.resolve(model1)));

    modelService
      .create$(model1)
      .subscribe((result: BaseModel) => expect(result).toEqual(model1, 'expected model1'));

    expect(httpBaseModelSpy.post.calls.count()).toBe(1, 'one call');
  });

  it('edit should not return anything', () => {
    httpBaseModelSpy.put.and.returnValue(defer(() => Promise.resolve()));

    modelService
      .edit$(model1)
      .subscribe((result: Object) => expect(result).toBeUndefined('expected undefined'));

    expect(httpBaseModelSpy.put.calls.count()).toBe(1, 'one call');
  });

  it('delete should not return anything', () => {
    httpBaseModelSpy.delete.and.returnValue(defer(() => Promise.resolve()));

    modelService
      .delete$(model1.id)
      .subscribe((result: Object) => expect(result).toBeUndefined('expected undefined'));

    expect(httpBaseModelSpy.delete.calls.count()).toBe(1, 'one call');
  });

});
