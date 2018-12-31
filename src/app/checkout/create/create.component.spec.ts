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
import { CreatePage } from '../../test/page-models/checkout/create-page';
import { CreateComponent } from './create.component';
import { OrdersService } from '../../orders/orders.service';
import { Order } from '../../orders/order';
import { CartProduct } from '../../cart-products/cart-product';
import { OrderProduct } from '../../order-products/order-product';

const cartProduct1: CartProduct = {
  model1Id: '1',
  model1Name: 'Cart 1',
  model2Id: '1',
  model2Name: 'Product 1',
  price: 1.00,
  extendedPrice: 1.00,
  isDownload: false,
  created: new Date(),
  quantity: 1
};
const cartProduct2: CartProduct = {
  model1Id: '1',
  model1Name: 'Cart 1',
  model2Id: '2',
  model2Name: 'Product 2',
  price: 2.00,
  extendedPrice: 2.00,
  isDownload: true,
  created: new Date(),
  quantity: 1
};
const cartProducts = [cartProduct1, cartProduct2];
const cartProductsGridDataResult: GridDataResult = {
  data: cartProducts,
  total: cartProducts.length
};
let component: CreateComponent;
let fixture: ComponentFixture<CreateComponent>;
let page: CreatePage;
let routerLinks: RouterLinkDirectiveStub[];
let routerLinkDebugElements: DebugElement[];
let ordersService: OrdersService;
let router: Router;

/* tslint:disable-next-line:component-selector */
@Component({ selector: 'router-outlet', template: '' })
class RouterOutletStubComponent { }

describe('CreateComponent', () => {

  beforeEach(() => setup());

  it('should have a new order', () => {
    expect(component.order.id).toBeUndefined();
    expect(component.order.name).toBeUndefined();
  });

  it('should display blank inputs', () => {
    return fixture.whenStable().then(() => {
      expect(page.name.value).toBe('');
    });
  });

  it('should call create and navigate on submit', () => {
    component.create();
    expect(ordersService.create$).toHaveBeenCalled();
    // expect(router.navigateByUrl).toHaveBeenCalled();
  });

  it('can get RouterLinks from template', () => {
    expect(routerLinks.length).toBe(1, 'should have 1 routerLink');
    expect(routerLinks[0].linkParams).toBe('/Orders');
  });

  it('can click Orders link in template', () => {
    const productsLinkDebugElement = routerLinkDebugElements[0];
    const productsLink = routerLinks[0];

    expect(productsLink.navigatedTo).toBeNull('should not have navigated yet');

    productsLinkDebugElement.triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(productsLink.navigatedTo).toBe('/Orders');
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
        provide: OrdersService,
        useValue: jasmine.createSpyObj('OrdersService', { create: of() })
      }
  ]
  });
  fixture = TestBed.createComponent(CreateComponent);
  component = fixture.componentInstance;
  ordersService = fixture.debugElement.injector.get(OrdersService);
  router = fixture.debugElement.injector.get(Router);
  page = new CreatePage(fixture);
  fixture.detectChanges();
  routerLinkDebugElements = fixture.debugElement.queryAll(By.directive(RouterLinkDirectiveStub));
  routerLinks = routerLinkDebugElements.map(de => de.injector.get(RouterLinkDirectiveStub));
}
