import { } from 'jasmine';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, DebugElement } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { By } from '@angular/platform-browser';
import { FormsModule, NgForm } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { GridModule } from '@progress/kendo-angular-grid';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { UploadModule } from '@progress/kendo-angular-upload';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RouterLinkDirectiveStub } from '../../test/stubs/router-link-directive-stub';
import { EditPage } from '../../test/page-models/products/edit-page';
import { EditComponent } from './edit.component';
import { AccountService } from '../../account/account.service';
import { ProductsController } from '../../products/products.controller';
import { Product } from '../product';
import { ProductFilesController } from '../../product-files/product-files.controller';

let product: Product;
let component: EditComponent;
let fixture: ComponentFixture<EditComponent>;
let page: EditPage;
let routerLinks: RouterLinkDirectiveStub[];
let routerLinkDebugElements: DebugElement[];
let accountService: AccountService;
let productsController: ProductsController;

/* tslint:disable-next-line:component-selector */
@Component({ selector: 'router-outlet', template: '' })
class RouterOutletStubComponent { }

describe('EditComponent', () => {

  beforeEach(() => {
    product = {
      id: '1',
      name: 'Product 1',
      active: true,
      description: 'Description 1',
      unitPrice: 1.00,
      quantityPerUnit: undefined,
      isDownload: false,
      created: new Date()
    };
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        HttpClientModule,
        GridModule,
        InputsModule,
        UploadModule,
        FontAwesomeModule
      ],
      declarations: [
        EditComponent,
        RouterLinkDirectiveStub,
        RouterOutletStubComponent
      ],
      providers: [
        {
          provide: Title,
          useValue: jasmine.createSpyObj('Title', ['setTitle'])
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {
                'product': product
              }
            }
          }
        },
        {
          provide: Router,
          useValue: jasmine.createSpyObj('Router', ['navigate'])
        },
        {
          provide: ToastrService,
          useValue: jasmine.createSpyObj('ToastrService', ['error'])
        },
        {
          provide: AccountService,
          useValue: jasmine.createSpyObj('AccountService', ['user$'])
        },
        {
          provide: ProductsController,
          useValue: jasmine.createSpyObj('ProductsController', { edit$: of() })
        },
        {
          provide: ProductFilesController,
          useValue: jasmine.createSpyObj('ProductFilesController', ['createRange$'])
        }
      ]
    });
    fixture = TestBed.createComponent(EditComponent);
    component = fixture.componentInstance;
    accountService = fixture.debugElement.injector.get(AccountService);
    accountService.userHasRole$ = (): Observable<boolean> => of(true);
    productsController = fixture.debugElement.injector.get(ProductsController);
    fixture.detectChanges();
    page = new EditPage(fixture);
    routerLinkDebugElements = fixture.debugElement.queryAll(By.directive(RouterLinkDirectiveStub));
    routerLinks = routerLinkDebugElements.map(de => de.injector.get(RouterLinkDirectiveStub));
  });

  it('should have the product', () => {
    expect(component.product).toEqual(product);
  });

  it('should display product details', () => {
    return fixture.whenStable().then(() => {
      expect(page.name.value).toBe(component.product.name);
      expect(page.active.value).toBe('on');
      expect(page.isDownload.value).toBe('on');
      expect(page.description.value).toBe(component.product.description);
      expect(page.unitPrice.value).toBe(`$${component.product.unitPrice.toFixed(2)}`);
      expect(page.quantityPerUnit.value).toBe('');
    });
  });

  it('should call edit for valid form', () => {
    const form = { valid: true } as NgForm;

    component.edit(form);
    expect(productsController.update$).toHaveBeenCalled();
  });

  it('should not call edit for invalid form', () => {
    const form = { valid: false } as NgForm;

    component.edit(form);
    expect(productsController.update$).not.toHaveBeenCalled();
  });

  it('can get RouterLinks from template', () => {
    expect(routerLinks.length).toBe(2, 'should have 2 routerLinks');
    expect(routerLinks[0].linkParams).toBe(`/products/details/${product.id}`);
    expect(routerLinks[1].linkParams).toBe('/products');
  });

  it('can click `products/details/:product.id` link in template', () => {
    const productsLinkDebugElement = routerLinkDebugElements[0];
    const productsLink = routerLinks[0];

    expect(productsLink.navigatedTo).toBeNull('should not have navigated yet');

    productsLinkDebugElement.triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(productsLink.navigatedTo).toBe(`/products/details/${product.id}`);
  });

  it('can click `products` link in template', () => {
    const productsLinkDebugElement = routerLinkDebugElements[1];
    const productsLink = routerLinks[1];

    expect(productsLink.navigatedTo).toBeNull('should not have navigated yet');

    productsLinkDebugElement.triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(productsLink.navigatedTo).toBe('/products');
  });

  afterEach(() => {
    product = undefined;
    component = undefined;
    productsController = undefined;
    page = undefined;
    routerLinkDebugElements = undefined;
    routerLinks = undefined;
    fixture.destroy();
  });

});
