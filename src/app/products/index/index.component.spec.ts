import { } from 'jasmine';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { Component, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { GridModule } from '@progress/kendo-angular-grid';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RouterLinkDirectiveStub } from '../../test/stubs/router-link-directive-stub';
import { IndexPage } from '../../test/page-models/products/index-page';
import { IndexComponent } from './index.component';
import { Product } from '../product';
import { CartProduct } from '../../cart-products/cart-product';
import { OrderProduct } from '../../order-products/order-product';
import { ProductFile } from '../../product-files/product-file';
import { ProductsService } from '../../products/products.service';
import { ProductCategory } from '../../product-categories/product-category';

const product1: Product = {
  id: '1',
  name: 'Product 1',
  active: true,
  description: 'Description 1',
  unitPrice: 1.00,
  quantityPerUnit: undefined,
  isDownload: false,
  created: new Date(),
  cartProducts: new Array<CartProduct>(),
  orderProducts: new Array<OrderProduct>(),
  productFiles: new Array<ProductFile>(),
  productCategories: new Array<ProductCategory>()
};
const product2: Product = {
  id: '2',
  name: 'Product 2',
  active: true,
  description: 'Description 2',
  unitPrice: 2.00,
  quantityPerUnit: undefined,
  isDownload: true,
  created: new Date(),
  cartProducts: new Array<CartProduct>(),
  orderProducts: new Array<OrderProduct>(),
  productFiles: new Array<ProductFile>(),
  productCategories: new Array<ProductCategory>()
};
const products = [product1, product2];
const productsGridDataResult = {
  data: products,
  total: products.length
} as GridDataResult;
let component: IndexComponent;
let fixture: ComponentFixture<IndexComponent>;
let page: IndexPage;
let routerLinks: RouterLinkDirectiveStub[];
let routerLinkDebugElements: DebugElement[];

/* tslint:disable-next-line:component-selector */
@Component({ selector: 'router-outlet', template: '' })
class RouterOutletStubComponent { }

describe('IndexComponent', () => {

  beforeEach(() => setup());

  it('should have the products', () => {
    expect(component.products.total).toBe(products.length);
  });

  it('should display products', () => {
    const cleanText = (text: string): string => text == null ? '' : text.trim();
    const productRow1 = page.rows[2];
    const productRow2 = page.rows[3];
    const productRow1Name = cleanText(productRow1.children[0].textContent);
    const productRow2Name = cleanText(productRow2.children[0].textContent);

    expect(productRow1Name).toBe(product1.name);
    expect(productRow2Name).toBe(product2.name);
  });

  it('can get RouterLinks from template', () => {
    expect(routerLinks.length).toBe(3, 'should have 3 routerLinks');
    expect(routerLinks[0].linkParams).toBe(`/Products/Details/${product1.id}`);
    expect(routerLinks[1].linkParams).toBe(`/Products/Details/${product2.id}`);
    expect(routerLinks[2].linkParams).toBe('/Products/Create');
  });

  it('can click Products/Details/:products[0].Id link in template', () => {
    const product1LinkDebugElement = routerLinkDebugElements[0];
    const product1Link = routerLinks[0];

    expect(product1Link.navigatedTo).toBeNull('should not have navigated yet');

    product1LinkDebugElement.triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(product1Link.navigatedTo).toBe(`/Products/Details/${product1.id}`);
  });

  it('can click Products/Details/:products[1].Id link in template', () => {
    const product2LinkDebugElement = routerLinkDebugElements[1];
    const product2Link = routerLinks[1];

    expect(product2Link.navigatedTo).toBeNull('should not have navigated yet');

    product2LinkDebugElement.triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(product2Link.navigatedTo).toBe(`/Products/Details/${product2.id}`);
  });

  it('can click Products/Create link in template', () => {
    const createLinkDebugElement = routerLinkDebugElements[2];
    const createLink = routerLinks[2];

    expect(createLink.navigatedTo).toBeNull('should not have navigated yet');

    createLinkDebugElement.triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(createLink.navigatedTo).toBe('/Products/Create');
  });

});

function setup() {
  TestBed.configureTestingModule({
    declarations: [
      IndexComponent,
      RouterLinkDirectiveStub,
      RouterOutletStubComponent
    ],
    providers: [
      {
        provide: ActivatedRoute,
        useValue: {
          snapshot: {
            data: { 'products': productsGridDataResult }
          }
        }
      },
      {
        provide: ProductsService,
        useValue: jasmine.createSpyObj('ProductsService', { index: of() })
      }
    ],
    imports: [
      GridModule,
      FontAwesomeModule
    ]
  });
  fixture = TestBed.createComponent(IndexComponent);
  component = fixture.componentInstance;
  page = new IndexPage(fixture);
  fixture.detectChanges();
  routerLinkDebugElements = fixture.debugElement.queryAll(By.directive(RouterLinkDirectiveStub));
  routerLinks = routerLinkDebugElements.map(de => de.injector.get(RouterLinkDirectiveStub));
}
