import { } from 'jasmine';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RouterLinkDirectiveStub } from '../../test/stubs/router-link-directive-stub';
import { DeletePage } from '../../test/page-models/products/delete-page';
import { DeleteComponent } from './delete.component';
import { Product } from '../product';
import { CartProduct } from '../../cart-products/cart-product';
import { OrderProduct } from '../../relationships/order-product';
import { ProductsService } from '../../products/products.service';

const product: Product = {
  id: '1',
  name: 'Product 1',
  description: 'Description 1',
  price: 1.00,
  cartProducts: new Array<CartProduct>(),
  orderProducts: new Array<OrderProduct>()
};
let component: DeleteComponent;
let fixture: ComponentFixture<DeleteComponent>;
let page: DeletePage;
let routerLinks: RouterLinkDirectiveStub[];
let routerLinkDebugElements: DebugElement[];
let productsService: ProductsService;
let router: Router;

/* tslint:disable-next-line:component-selector */
@Component({ selector: 'router-outlet', template: '' })
class RouterOutletStubComponent { }

describe('DeleteComponent', () => {

  beforeEach(() => setup());

  it('should have the product', () => {
    expect(component.product.id).toBe(product.id);
    expect(component.product.name).toBe(product.name);
  });

  it('should display product details', () => {
    expect(page.name).toBe(component.product.name);
  });

  it('should call delete and navigate on submit', () => {
    component.delete();
    expect(productsService.delete).toHaveBeenCalled();
    // expect(router.navigateByUrl).toHaveBeenCalled();
  });

  it('can get RouterLinks from template', () => {
    expect(routerLinks.length).toBe(2, 'should have 2 routerLinks');
    expect(routerLinks[0].linkParams).toBe(`/Products/Details/${product.id}`);
    expect(routerLinks[1].linkParams).toBe('/Products');
  });

  it('can click Products/Details/:product.Id link in template', () => {
    const productsLinkDebugElement = routerLinkDebugElements[0];
    const productsLink = routerLinks[0];

    expect(productsLink.navigatedTo).toBeNull('should not have navigated yet');

    productsLinkDebugElement.triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(productsLink.navigatedTo).toBe(`/Products/Details/${product.id}`);
  });

  it('can click Products link in template', () => {
    const productsLinkDebugElement = routerLinkDebugElements[1];
    const productsLink = routerLinks[1];

    expect(productsLink.navigatedTo).toBeNull('should not have navigated yet');

    productsLinkDebugElement.triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(productsLink.navigatedTo).toBe('/Products');
  });

});

function setup() {
  TestBed.configureTestingModule({
    imports: [
      FontAwesomeModule
    ],
    declarations: [
      DeleteComponent,
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
      },
      {
        provide: ProductsService,
        useValue: jasmine.createSpyObj('ProductsService', {delete: of()})
      }
    ]
  });
  fixture = TestBed.createComponent(DeleteComponent);
  component = fixture.componentInstance;
  productsService = fixture.debugElement.injector.get(ProductsService);
  router = fixture.debugElement.injector.get(Router);
  page = new DeletePage(fixture);
  fixture.detectChanges();
  routerLinkDebugElements = fixture.debugElement.queryAll(By.directive(RouterLinkDirectiveStub));
  routerLinks = routerLinkDebugElements.map(de => de.injector.get(RouterLinkDirectiveStub));
}
