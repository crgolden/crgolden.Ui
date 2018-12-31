import { } from 'jasmine';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { GridModule } from '@progress/kendo-angular-grid';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RouterLinkDirectiveStub } from '../../test/stubs/router-link-directive-stub';
import { DetailsPage } from '../../test/page-models/orders/details-page';
import { DetailsComponent } from './details.component';
import { Order } from '../order';
import { OrderProduct } from '../../order-products/order-product';

const order: Order = {
  id: '1',
  userId: '1',
  name: 'Order 1',
  created: new Date(),
  orderProducts: new Array<OrderProduct>()
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

  it('should have the order', () => {
    expect(component.order.id).toBe(order.id);
    expect(component.order.name).toBe(order.name);
  });

  it('should display order details', () => {
    expect(page.name).toBe(component.order.name);
  });

  it('can get RouterLinks from template', () => {
    expect(routerLinks.length).toBe(3, 'should have 3 routerLinks');
    expect(routerLinks[0].linkParams).toBe('/Orders');
    expect(routerLinks[1].linkParams).toBe(`/Orders/Edit/${order.id}`);
    expect(routerLinks[2].linkParams).toBe(`/Orders/Delete/${order.id}`);
  });

  it('can click Orders link in template', () => {
    const ordersLinkDebugElement = routerLinkDebugElements[0];
    const ordersLink = routerLinks[0];

    expect(ordersLink.navigatedTo).toBeNull('should not have navigated yet');

    ordersLinkDebugElement.triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(ordersLink.navigatedTo).toBe('/Orders');
  });

  it('can click Orders/Edit/:order.Id link in template', () => {
    const orderLinkDebugElement = routerLinkDebugElements[1];
    const orderLink = routerLinks[1];

    expect(orderLink.navigatedTo).toBeNull('should not have navigated yet');

    orderLinkDebugElement.triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(orderLink.navigatedTo).toBe(`/Orders/Edit/${order.id}`);
  });

  it('can click Orders/Delete/:order.Id link in template', () => {
    const orderLinkDebugElement = routerLinkDebugElements[2];
    const orderLink = routerLinks[2];

    expect(orderLink.navigatedTo).toBeNull('should not have navigated yet');

    orderLinkDebugElement.triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(orderLink.navigatedTo).toBe(`/Orders/Delete/${order.id}`);
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
            data: { 'order': order }
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
