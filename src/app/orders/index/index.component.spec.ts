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
import { IndexPage } from '../../test/page-models/orders/index-page';
import { IndexComponent } from './index.component';
import { Order } from '../order';
import { OrderProduct } from '../../order-products/order-product';
import { OrdersService } from '../../orders/orders.service';

const order1: Order = {
  id: '1',
  userId: '1',
  name: 'Order 1',
  created: new Date(),
  orderProducts: new Array<OrderProduct>()
};
const order2: Order = {
  id: '2',
  userId: '1',
  name: 'Order 2',
  created: new Date(),
  orderProducts: new Array<OrderProduct>()
};
const orders = [order1, order2];
const ordersGridDataResult = {
  data: orders,
  total: orders.length
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

  it('should have the orders', () => {
    expect(component.orders.total).toBe(orders.length);
  });

  it('should display orders', () => {
    const cleanText = (text: string): string => text == null ? '' : text.trim();
    const orderRow1 = page.rows[2];
    const orderRow2 = page.rows[3];
    const orderRow1Name = cleanText(orderRow1.children[0].textContent);
    const orderRow2Name = cleanText(orderRow2.children[0].textContent);

    expect(orderRow1Name).toBe(order1.name);
    expect(orderRow2Name).toBe(order2.name);
  });

  it('can get RouterLinks from template', () => {
    expect(routerLinks.length).toBe(3, 'should have 3 routerLinks');
    expect(routerLinks[0].linkParams).toBe(`/Orders/Details/${order1.id}`);
    expect(routerLinks[1].linkParams).toBe(`/Orders/Details/${order2.id}`);
    expect(routerLinks[2].linkParams).toBe('/Orders/Create');
  });

  it('can click Orders/Details/:orders[0].Id link in template', () => {
    const order1LinkDebugElement = routerLinkDebugElements[0];
    const order1Link = routerLinks[0];

    expect(order1Link.navigatedTo).toBeNull('should not have navigated yet');

    order1LinkDebugElement.triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(order1Link.navigatedTo).toBe(`/Orders/Details/${order1.id}`);
  });

  it('can click Orders/Details/:orders[1].Id link in template', () => {
    const order2LinkDebugElement = routerLinkDebugElements[1];
    const order2Link = routerLinks[1];

    expect(order2Link.navigatedTo).toBeNull('should not have navigated yet');

    order2LinkDebugElement.triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(order2Link.navigatedTo).toBe(`/Orders/Details/${order2.id}`);
  });

  it('can click Orders/Create link in template', () => {
    const createLinkDebugElement = routerLinkDebugElements[2];
    const createLink = routerLinks[2];

    expect(createLink.navigatedTo).toBeNull('should not have navigated yet');

    createLinkDebugElement.triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(createLink.navigatedTo).toBe('/Orders/Create');
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
            data: { 'orders': ordersGridDataResult }
          }
        }
      },
      {
        provide: OrdersService,
        useValue: jasmine.createSpyObj('ordersService', { index: of() })
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
