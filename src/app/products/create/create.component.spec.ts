import { } from 'jasmine';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Component, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { FormsModule, NgForm } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { GridModule } from '@progress/kendo-angular-grid';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RouterLinkDirectiveStub } from '../../test//stubs/router-link-directive-stub';
import { CreatePage } from '../../test/page-models/products/create-page';
import { CreateComponent } from './create.component';
import { AccountService } from '../../account/account.service';
import { ProductsService } from '../../products/products.service';

let component: CreateComponent;
let fixture: ComponentFixture<CreateComponent>;
let page: CreatePage;
let routerLinks: Array<RouterLinkDirectiveStub>;
let routerLinkDebugElements: Array<DebugElement>;
let accountService: AccountService;
let productsService: ProductsService;

/* tslint:disable-next-line:component-selector */
@Component({ selector: 'router-outlet', template: '' })
class RouterOutletStubComponent { }

describe('CreateComponent', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        GridModule,
        InputsModule,
        FontAwesomeModule
      ],
      declarations: [
        CreateComponent,
        RouterLinkDirectiveStub,
        RouterOutletStubComponent
      ],
      providers: [
        {
          provide: Title,
          useValue: jasmine.createSpyObj('Title', ['setTitle'])
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
          provide: ProductsService,
          useValue: jasmine.createSpyObj('ProductsService', { create$: of() })
        }
      ]
    });
    fixture = TestBed.createComponent(CreateComponent);
    component = fixture.componentInstance;
    accountService = fixture.debugElement.injector.get(AccountService);
    accountService.userHasRole$ = (): Observable<boolean> => of(true);
    productsService = fixture.debugElement.injector.get(ProductsService);
    fixture.detectChanges();
    page = new CreatePage(fixture);
    routerLinkDebugElements = fixture.debugElement.queryAll(By.directive(RouterLinkDirectiveStub));
    routerLinks = routerLinkDebugElements.map(de => de.injector.get(RouterLinkDirectiveStub));
  });

  it('should have a new product', () => {
    expect(component.product.id).toBeUndefined();
    expect(component.product.name).toBeUndefined();
    expect(component.product.active).toBe(true);
    expect(component.product.isDownload).toBe(false);
    expect(component.product.description).toBeUndefined();
    expect(component.product.unitPrice).toBe(0.00);
    expect(component.product.quantityPerUnit).toBeUndefined();
  });

  it('should display blank inputs', () => {
    return fixture.whenStable().then(() => {
      expect(page.name.value).toBe('');
      expect(page.active.value).toBe('on');
      expect(page.isDownload.value).toBe('on');
      expect(page.description.value).toBe('');
      expect(page.unitPrice.value).toBe('$0.00');
      expect(page.quantityPerUnit.value).toBe('');
    });
  });

  it('should call create for valid form', () => {
    const form = { valid: true } as NgForm;

    component.create(form);
    expect(productsService.create$).toHaveBeenCalled();
  });

  it('should not call create for invalid form', () => {
    const form = { valid: false } as NgForm;

    component.create(form);
    expect(productsService.create$).not.toHaveBeenCalled();
  });

  it('can get RouterLinks from template', () => {
    expect(routerLinks.length).toBe(1, 'should have 1 routerLink');
    expect(routerLinks[0].linkParams).toBe('/products');
  });

  it('can click Products link in template', () => {
    const productsLinkDebugElement = routerLinkDebugElements[0];
    const productsLink = routerLinks[0];

    expect(productsLink.navigatedTo).toBeNull('should not have navigated yet');

    productsLinkDebugElement.triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(productsLink.navigatedTo).toBe('/products');
  });

  afterEach(() => {
    component = undefined;
    accountService = undefined;
    productsService = undefined;
    page = undefined;
    routerLinkDebugElements = undefined;
    routerLinks = undefined;
    fixture.destroy();
  });

});
