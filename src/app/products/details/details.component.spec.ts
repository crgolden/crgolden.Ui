import { } from 'jasmine';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { GridModule } from '@progress/kendo-angular-grid';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RouterLinkDirectiveStub } from '../../test/stubs/router-link-directive-stub';
import { ToastrService } from 'ngx-toastr';
import { DetailsPage } from '../../test/page-models/products/details-page';
import { DetailsComponent } from './details.component';
import { Product } from '../product';
import { AccountService } from '../../account/account.service';
import { CartsService } from '../../carts/carts.service';
import { Cart } from '../../carts/cart';
import { CartProductsService } from '../../cart-products/cart-products.service';

let product: Product;
let component: DetailsComponent;
let fixture: ComponentFixture<DetailsComponent>;
let page: DetailsPage;
let routerLinks: Array<RouterLinkDirectiveStub>;
let routerLinkDebugElements: Array<DebugElement>;
let accountService: AccountService;
let cartsService: CartsService;

/* tslint:disable-next-line:component-selector */
@Component({ selector: 'router-outlet', template: '' })
class RouterOutletStubComponent { }

describe('DetailsComponent', () => {

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
      declarations: [
        DetailsComponent,
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
              data: { 'product': product }
            }
          }
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
          provide: CartsService,
          useValue: jasmine.createSpyObj('CartsService', ['cart$'])
        },
        {
          provide: CartProductsService,
          useValue: jasmine.createSpyObj('CartProductsService', ['create$, delete$'])
        },
        {
          provide: Router,
          useValue: jasmine.createSpyObj('Router', ['navigate'])
        }
      ],
      imports: [
        GridModule,
        FontAwesomeModule
      ]
    });
    fixture = TestBed.createComponent(DetailsComponent);
    component = fixture.componentInstance;
    accountService = fixture.debugElement.injector.get(AccountService);
    accountService.userHasRole$ = (): Observable<boolean> => of(true);
    cartsService = fixture.debugElement.injector.get(CartsService);
    cartsService.cart$ = new BehaviorSubject<Cart>(undefined);
    fixture.detectChanges();
    page = new DetailsPage(fixture);
    routerLinkDebugElements = fixture.debugElement.queryAll(By.directive(RouterLinkDirectiveStub));
    routerLinks = routerLinkDebugElements.map(de => de.injector.get(RouterLinkDirectiveStub));
  });

  it('should have the product', () => {
    expect(component.product).toEqual(product);
  });

  it('should display product details', () => {
    expect(page.name.textContent.trim()).toBe(component.product.name);
    expect(page.description.textContent.trim()).toBe(component.product.description);
    expect(page.unitPrice.textContent.trim()).toBe(`$${component.product.unitPrice.toFixed(2)}`);
    expect(page.quantityPerUnit.textContent.trim()).toBe('');
  });

  it('can get RouterLinks from template', () => {
    expect(routerLinks.length).toBe(2, 'should have 3 routerLinks');
    expect(routerLinks[0].linkParams).toBe('/products');
    expect(routerLinks[1].linkParams).toBe(`/products/edit/${product.id}`);
  });

  it('can click `products` link in template', () => {
    const productsLinkDebugElement = routerLinkDebugElements[0];
    const productsLink = routerLinks[0];

    expect(productsLink.navigatedTo).toBeNull('should not have navigated yet');

    productsLinkDebugElement.triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(productsLink.navigatedTo).toBe('/products');
  });

  it('can click `products/edit/:product.id` link in template', () => {
    const productLinkDebugElement = routerLinkDebugElements[1];
    const productLink = routerLinks[1];

    expect(productLink.navigatedTo).toBeNull('should not have navigated yet');

    productLinkDebugElement.triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(productLink.navigatedTo).toBe(`/products/edit/${product.id}`);
  });

  afterEach(() => {
    product = undefined;
    component = undefined;
    page = undefined;
    routerLinkDebugElements = undefined;
    routerLinks = undefined;
    fixture.destroy();
  });

});
