import { } from 'jasmine';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { GridModule } from '@progress/kendo-angular-grid';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RouterLinkDirectiveStub } from '../../test/stubs/router-link-directive-stub';
import { DetailsPage } from '../../test/page-models/products/details-page';
import { DetailsComponent } from './details.component';
import { Product } from '../product';
import { CartProduct } from '../../cart-products/cart-product';
import { OrderProduct } from '../../order-products/order-product';
import { ProductFile } from '../../product-files/product-file';

const product: Product = {
  id: '1',
  name: 'Product 1',
  active: true,
  description: 'Description 1',
  price: 1.00,
  isDownload: false,
  created: new Date(),
  cartProducts: new Array<CartProduct>(),
  orderProducts: new Array<OrderProduct>(),
  productFiles: new Array<ProductFile>()
};
let component: DetailsComponent;
let fixture: ComponentFixture<DetailsComponent>;
let page: DetailsPage;
let routerLinks: RouterLinkDirectiveStub[];
let routerLinkDebugElements: DebugElement[];

/* tslint:disable-next-line:component-selector */
@Component({ selector: 'router-outlet', template: '' })
class RouterOutletStubComponent { }

describe('DetailsComponent', () => {

  beforeEach(() => setup());

  it('should have the product', () => {
    expect(component.product.id).toBe(product.id);
    expect(component.product.name).toBe(product.name);
  });

  it('should display product details', () => {
    expect(page.name).toBe(component.product.name);
  });

  it('can get RouterLinks from template', () => {
    expect(routerLinks.length).toBe(3, 'should have 3 routerLinks');
    expect(routerLinks[0].linkParams).toBe('/Products');
    expect(routerLinks[1].linkParams).toBe(`/Products/Edit/${product.id}`);
    expect(routerLinks[2].linkParams).toBe(`/Products/Delete/${product.id}`);
  });

  it('can click Products link in template', () => {
    const productsLinkDebugElement = routerLinkDebugElements[0];
    const productsLink = routerLinks[0];

    expect(productsLink.navigatedTo).toBeNull('should not have navigated yet');

    productsLinkDebugElement.triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(productsLink.navigatedTo).toBe('/Products');
  });

  it('can click Products/Edit/:product.Id link in template', () => {
    const productLinkDebugElement = routerLinkDebugElements[1];
    const productLink = routerLinks[1];

    expect(productLink.navigatedTo).toBeNull('should not have navigated yet');

    productLinkDebugElement.triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(productLink.navigatedTo).toBe(`/Products/Edit/${product.id}`);
  });

  it('can click Products/Delete/:product.Id link in template', () => {
    const productLinkDebugElement = routerLinkDebugElements[2];
    const productLink = routerLinks[2];

    expect(productLink.navigatedTo).toBeNull('should not have navigated yet');

    productLinkDebugElement.triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(productLink.navigatedTo).toBe(`/Products/Delete/${product.id}`);
  });

});

function setup() {
  TestBed.configureTestingModule({
    declarations: [
      DetailsComponent,
      RouterLinkDirectiveStub,
      RouterOutletStubComponent
    ],
    providers: [
      {
        provide: ActivatedRoute,
        useValue: {
          snapshot: {
            data: { 'product': product }
          }
        }
      },
      {
        provide: Router,
        useValue: jasmine.createSpyObj('Router', ['navigateByUrl'])
      }
    ],
    imports: [
      GridModule,
      FontAwesomeModule
    ]
  });
  fixture = TestBed.createComponent(DetailsComponent);
  component = fixture.componentInstance;
  page = new DetailsPage(fixture);
  fixture.detectChanges();
  routerLinkDebugElements = fixture.debugElement.queryAll(By.directive(RouterLinkDirectiveStub));
  routerLinks = routerLinkDebugElements.map(de => de.injector.get(RouterLinkDirectiveStub));
}
