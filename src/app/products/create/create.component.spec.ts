import { } from 'jasmine';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Component, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { FormsModule, NgForm } from '@angular/forms';
import { of } from 'rxjs';
import { GridModule } from '@progress/kendo-angular-grid';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RouterLinkDirectiveStub } from '../../test//stubs/router-link-directive-stub';
import { CreatePage } from '../../test/page-models/products/create-page';
import { CreateComponent } from './create.component';
import { ProductsService } from '../../products/products.service';
import { Product } from '../product';
import { CartProduct } from '../../cart-products/cart-product';
import { OrderProduct } from '../../order-products/order-product';
import { ProductFile } from '../../product-files/product-file';

const product1: Product = {
  id: '1',
  name: 'Product 1',
  active: true,
  description: 'Description 1',
  price: 1.00,
  isDownload: true,
  created: new Date(),
  cartProducts: new Array<CartProduct>(),
  orderProducts: new Array<OrderProduct>(),
  productFiles: new Array<ProductFile>()
};
const product2: Product = {
  id: '2',
  name: 'Product 2',
  active: true,
  description: 'Description 2',
  price: 2.00,
  isDownload: false,
  created: new Date(),
  cartProducts: new Array<CartProduct>(),
  orderProducts: new Array<OrderProduct>(),
  productFiles: new Array<ProductFile>()
};
const products = [product1, product2];
const productsGridDataResult: GridDataResult = {
  data: products,
  total: products.length
};
let component: CreateComponent;
let fixture: ComponentFixture<CreateComponent>;
let page: CreatePage;
let routerLinks: RouterLinkDirectiveStub[];
let routerLinkDebugElements: DebugElement[];
let productsService: ProductsService;
let router: Router;

/* tslint:disable-next-line:component-selector */
@Component({ selector: 'router-outlet', template: '' })
class RouterOutletStubComponent { }

describe('CreateComponent', () => {

  beforeEach(() => setup());

  it('should have a new product', () => {
    expect(component.product.id).toBeUndefined();
    expect(component.product.name).toBeUndefined();
  });

  it('should display blank inputs', () => {
    return fixture.whenStable().then(() => {
      expect(page.name.value).toBe('');
    });
  });

  it('should call create and navigate on submit', () => {
    const form = { valid: true } as NgForm;

    component.create(form);
    expect(productsService.create$).toHaveBeenCalled();
    // expect(router.navigateByUrl).toHaveBeenCalled();
  });

  it('can get RouterLinks from template', () => {
    expect(routerLinks.length).toBe(1, 'should have 1 routerLink');
    expect(routerLinks[0].linkParams).toBe('/Products');
  });

  it('can click Products link in template', () => {
    const productsLinkDebugElement = routerLinkDebugElements[0];
    const productsLink = routerLinks[0];

    expect(productsLink.navigatedTo).toBeNull('should not have navigated yet');

    productsLinkDebugElement.triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(productsLink.navigatedTo).toBe('/Products');
  });

});

function setup() {
  TestBed.configureTestingModule({
    imports: [
      FormsModule,
      GridModule,
      FontAwesomeModule
    ],
    declarations: [
      CreateComponent,
      RouterLinkDirectiveStub,
      RouterOutletStubComponent
    ],
    providers: [
      {
        provide: Router,
        useValue: jasmine.createSpyObj('Router', ['navigateByUrl'])
      },
      {
        provide: ProductsService,
        useValue: jasmine.createSpyObj('ProductsService', { create: of() })
      }
  ]
  });
  fixture = TestBed.createComponent(CreateComponent);
  component = fixture.componentInstance;
  productsService = fixture.debugElement.injector.get(ProductsService);
  router = fixture.debugElement.injector.get(Router);
  page = new CreatePage(fixture);
  fixture.detectChanges();
  routerLinkDebugElements = fixture.debugElement.queryAll(By.directive(RouterLinkDirectiveStub));
  routerLinks = routerLinkDebugElements.map(de => de.injector.get(RouterLinkDirectiveStub));
}
