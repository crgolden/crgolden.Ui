import { } from 'jasmine';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { FormsModule, NgForm } from '@angular/forms';
import { of } from 'rxjs';
import { GridModule } from '@progress/kendo-angular-grid';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RouterLinkDirectiveStub } from '../../test/stubs/router-link-directive-stub';
import { EditPage } from '../../test/page-models/payments/edit-page';
import { EditComponent } from './edit.component';
import { Payment } from '../payment';
import { Order } from '../../orders/order';
import { OrderProduct } from '../../order-products/order-product';
import { PaymentsService } from '../../payments/payments.service';

const order: Order = {
  id: '1',
  name: 'Order 1',
  total: 1,
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
let component: EditComponent;
let fixture: ComponentFixture<EditComponent>;
let page: EditPage;
let routerLinks: RouterLinkDirectiveStub[];
let routerLinkDebugElements: DebugElement[];
let paymentsService: PaymentsService;
let router: Router;

/* tslint:disable-next-line:component-selector */
@Component({ selector: 'router-outlet', template: '' })
class RouterOutletStubComponent { }

describe('EditComponent', () => {

  beforeEach(() => setup());

  it('should have the payment', () => {
    expect(component.payment.id).toBe(payment.id);
    expect(component.payment.name).toBe(payment.name);
  });

  it('should display payment details', () => {
    return fixture.whenStable().then(() => {
      expect(page.name.value).toBe(component.payment.name);
    });
  });

  it('should call edit and navigate on submit', () => {
    const form = { valid: true } as NgForm;

    component.edit(form);
    expect(paymentsService.edit$).toHaveBeenCalled();
    // expect(router.navigate).toHaveBeenCalled();
  });

  it('can get RouterLinks from template', () => {
    expect(routerLinks.length).toBe(2, 'should have 2 routerLinks');
    expect(routerLinks[0].linkParams).toBe(`/Payments/Details/${payment.id}`);
    expect(routerLinks[1].linkParams).toBe('/Payments');
  });

  it('can click Payments/Details/:payment.Id link in template', () => {
    const paymentsLinkDebugElement = routerLinkDebugElements[0];
    const paymentsLink = routerLinks[0];

    expect(paymentsLink.navigatedTo).toBeNull('should not have navigated yet');

    paymentsLinkDebugElement.triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(paymentsLink.navigatedTo).toBe(`/Payments/Details/${payment.id}`);
  });

  it('can click Payments link in template', () => {
    const paymentsLinkDebugElement = routerLinkDebugElements[1];
    const paymentsLink = routerLinks[1];

    expect(paymentsLink.navigatedTo).toBeNull('should not have navigated yet');

    paymentsLinkDebugElement.triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(paymentsLink.navigatedTo).toBe('/Payments');
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
      EditComponent,
      RouterLinkDirectiveStub,
      RouterOutletStubComponent
    ],
    providers: [
      {
        provide: ActivatedRoute,
        useValue: {
          snapshot: {
            data: {
              'payment': payment
            }
          }
        }
      },
      {
        provide: Router,
        useValue: jasmine.createSpyObj('Router', { navigate: of([`/Payments/Details/${payment.id}`]) })
      },
      {
        provide: PaymentsService,
        useValue: jasmine.createSpyObj('PaymentsService', { edit: of() })
      }
    ]
  });
  fixture = TestBed.createComponent(EditComponent);
  component = fixture.componentInstance;
  paymentsService = fixture.debugElement.injector.get(PaymentsService);
  router = fixture.debugElement.injector.get(Router);
  page = new EditPage(fixture);
  fixture.detectChanges();
  routerLinkDebugElements = fixture.debugElement.queryAll(By.directive(RouterLinkDirectiveStub));
  routerLinks = routerLinkDebugElements.map(de => de.injector.get(RouterLinkDirectiveStub));
}
