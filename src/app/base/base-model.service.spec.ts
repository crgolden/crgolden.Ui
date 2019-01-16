import { } from 'jasmine';
import { defer } from 'rxjs';
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
      name: 'Model 1',
      created: new Date()
    };
  });

  it('index should return a list of models', (done: DoneFn) => {
    const model2: BaseModel = {
      id: '2',
      name: 'Model 2',
      created: new Date()
    };
    const models = new Array<BaseModel>(model1, model2);
    const modelsGridDataResult: GridDataResult = {
      data: models,
      total: models.length
    };

    httpBaseModelSpy.get.and.returnValue(defer(() => Promise.resolve(modelsGridDataResult)));

    modelService
      .index$({})
      .subscribe((result: GridDataResult) => {
        expect(result).toEqual(modelsGridDataResult, 'expected models');
        expect(httpBaseModelSpy.get.calls.count()).toBe(1, 'one call');
        done();
      });
  });

  it('details should return a model', (done: DoneFn) => {
    httpBaseModelSpy.get.and.returnValue(defer(() => Promise.resolve(model1)));

    modelService
      .details$(model1.id)
      .subscribe((result: BaseModel) => {
        expect(result).toEqual(model1, 'expected model1');
        expect(httpBaseModelSpy.get.calls.count()).toBe(1, 'one call');
        done();
      });
  });

  it('create should return a model', (done: DoneFn) => {
    httpBaseModelSpy.post.and.returnValue(defer(() => Promise.resolve(model1)));

    modelService
      .create$(model1)
      .subscribe((result: BaseModel) => {
        expect(result).toEqual(model1, 'expected model1');
        expect(httpBaseModelSpy.post.calls.count()).toBe(1, 'one call');
        done();
      });
  });

  it('edit should not return anything', (done: DoneFn) => {
    httpBaseModelSpy.put.and.returnValue(defer(() => Promise.resolve()));

    modelService
      .edit$(model1)
      .subscribe((result: Object) => {
        expect(result).toBeUndefined('expected undefined');
        expect(httpBaseModelSpy.put.calls.count()).toBe(1, 'one call');
        done();
      });
  });

  it('delete should not return anything', (done: DoneFn) => {
    httpBaseModelSpy.delete.and.returnValue(defer(() => Promise.resolve()));

    modelService
      .delete$(model1.id)
      .subscribe((result: Object) => {
        expect(result).toBeUndefined('expected undefined');
        expect(httpBaseModelSpy.delete.calls.count()).toBe(1, 'one call');
        done();
      });
  });

  afterEach(() => {
    httpBaseModelSpy = undefined;
    modelService = undefined;
    model1 = undefined;
  });

});
