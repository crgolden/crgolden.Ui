import { } from 'jasmine';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { GridModule } from '@progress/kendo-angular-grid';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RouterLinkDirectiveStub } from '../../test/stubs/router-link-directive-stub';
import { DetailsPage } from '../../test/page-models/payments/details-page';
import { DetailsComponent } from './details.component';
import { Payment } from '../payment';
import { Order } from '../../orders/order';
import { OrderProduct } from '../../order-products/order-product';

const order: Order = {
  id: '1',
  name: 'Order 1',
  userId: '1',
  created: new Date(),
  orderProducts: new Array<OrderProduct>(),
  payments: new Array<Payment>()
};
const payment: Payment = {
  id: '1',
  name: 'Payment 1',
  userId: order.userId,
  description: 'Description 1',
  currency: 'usd',
  tokenId: 'tokenId 1',
  amount: 1.00,
  created: new Date(),
  orderId: order.id
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

  it('should have the payment', () => {
    expect(component.payment.id).toBe(payment.id);
    expect(component.payment.name).toBe(payment.name);
  });

  it('should display payment details', () => {
    expect(page.name).toBe(component.payment.name);
  });

  it('can get RouterLinks from template', () => {
    expect(routerLinks.length).toBe(3, 'should have 3 routerLinks');
    expect(routerLinks[0].linkParams).toBe('/Payments');
    expect(routerLinks[1].linkParams).toBe(`/Payments/Edit/${payment.id}`);
    expect(routerLinks[2].linkParams).toBe(`/Payments/Delete/${payment.id}`);
  });

  it('can click Payments link in template', () => {
    const paymentsLinkDebugElement = routerLinkDebugElements[0];
    const paymentsLink = routerLinks[0];

    expect(paymentsLink.navigatedTo).toBeNull('should not have navigated yet');

    paymentsLinkDebugElement.triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(paymentsLink.navigatedTo).toBe('/Payments');
  });

  it('can click Payments/Edit/:payment.Id link in template', () => {
    const paymentLinkDebugElement = routerLinkDebugElements[1];
    const paymentLink = routerLinks[1];

    expect(paymentLink.navigatedTo).toBeNull('should not have navigated yet');

    paymentLinkDebugElement.triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(paymentLink.navigatedTo).toBe(`/Payments/Edit/${payment.id}`);
  });

  it('can click Payments/Delete/:payment.Id link in template', () => {
    const paymentLinkDebugElement = routerLinkDebugElements[2];
    const paymentLink = routerLinks[2];

    expect(paymentLink.navigatedTo).toBeNull('should not have navigated yet');

    paymentLinkDebugElement.triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(paymentLink.navigatedTo).toBe(`/Payments/Delete/${payment.id}`);
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
            data: { 'payment': payment }
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
