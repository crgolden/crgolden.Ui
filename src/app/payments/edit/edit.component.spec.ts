import { } from 'jasmine';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { FormsModule, NgForm } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { GridModule } from '@progress/kendo-angular-grid';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RouterLinkDirectiveStub } from '../../test/stubs/router-link-directive-stub';
import { EditPage } from '../../test/page-models/payments/edit-page';
import { EditComponent } from './edit.component';
import { AccountService } from '../../account/account.service';
import { Payment } from '../payment';
import { Order } from '../../orders/order';
import { PaymentsService } from '../../payments/payments.service';

let order: Order;
let payment: Payment;
let component: EditComponent;
let fixture: ComponentFixture<EditComponent>;
let page: EditPage;
let routerLinks: Array<RouterLinkDirectiveStub>;
let routerLinkDebugElements: Array<DebugElement>;
let accountService: AccountService;
let paymentsService: PaymentsService;

/* tslint:disable-next-line:component-selector */
@Component({ selector: 'router-outlet', template: '' })
class RouterOutletStubComponent { }

describe('EditComponent', () => {

  beforeEach(() => {
    order = {
      id: '1',
      userId: '1',
      number: 1,
      total: 1,
      created: new Date(),
      shippingAddress: {
        street_address: 'Street',
        locality: 'City',
        region: 'Region',
        postal_code: '12345',
        country: 'Country'
      }
    };
    payment = {
      id: '1',
      chargeId: 'Payment 1',
      customerCode: 'Code 1',
      userId: order.userId,
      description: 'Description 1',
      currency: 'usd',
      tokenId: 'TokenId 1',
      amount: 1.00,
      created: new Date(),
      orderId: order.id
    };
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
          provide: Title,
          useValue: jasmine.createSpyObj('Title', ['setTitle'])
        },
        {
          provide: ToastrService,
          useValue: jasmine.createSpyObj('ToastrService', ['error'])
        },
        {
          provide: AccountService,
          useValue: jasmine.createSpyObj('AccountService', ['user$, userHasRole$'])
        },
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
          useValue: jasmine.createSpyObj('Router', ['navigate'])
        },
        {
          provide: PaymentsService,
          useValue: jasmine.createSpyObj('PaymentsService', { edit$: of() })
        }
      ]
    });
    fixture = TestBed.createComponent(EditComponent);
    component = fixture.componentInstance;
    accountService = fixture.debugElement.injector.get(AccountService);
    accountService.userHasRole$ = (): Observable<boolean> => of(true);
    paymentsService = fixture.debugElement.injector.get(PaymentsService);
    fixture.detectChanges();
    page = new EditPage(fixture);
    routerLinkDebugElements = fixture.debugElement.queryAll(By.directive(RouterLinkDirectiveStub));
    routerLinks = routerLinkDebugElements.map(de => de.injector.get(RouterLinkDirectiveStub));
  });

  it('should have the payment', () => {
    expect(component.payment).toEqual(payment);
  });

  it('should display payment details', () => {
    return fixture.whenStable().then(() => {
      expect(page.chargeId.textContent.trim()).toBe(component.payment.chargeId);
      expect(page.amount.textContent.trim()).toBe(`$${component.payment.amount.toFixed(2)}`);
      expect(page.description.value).toBe(component.payment.description);
    });
  });

  it('should call edit for valid form', () => {
    const form = { valid: true } as NgForm;

    component.edit(form);
    expect(paymentsService.edit$).toHaveBeenCalled();
  });

  it('should not call edit for invalid form', () => {
    const form = { valid: false } as NgForm;

    component.edit(form);
    expect(paymentsService.edit$).not.toHaveBeenCalled();
  });

  it('can get RouterLinks from template', () => {
    expect(routerLinks.length).toBe(2, 'should have 2 routerLinks');
    expect(routerLinks[0].linkParams).toBe(`/payments/details/${payment.id}`);
    expect(routerLinks[1].linkParams).toBe(`/orders/details/${payment.orderId}`);
  });

  it('can click `orders/details/:payment.orderId` link in template', () => {
    const paymentsLinkDebugElement = routerLinkDebugElements[0];
    const paymentsLink = routerLinks[0];

    expect(paymentsLink.navigatedTo).toBeNull('should not have navigated yet');

    paymentsLinkDebugElement.triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(paymentsLink.navigatedTo).toBe(`/payments/details/${payment.id}`);
  });

  it('can click `payments/details/:payment.id` link in template', () => {
    const paymentsLinkDebugElement = routerLinkDebugElements[1];
    const paymentsLink = routerLinks[1];

    expect(paymentsLink.navigatedTo).toBeNull('should not have navigated yet');

    paymentsLinkDebugElement.triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(paymentsLink.navigatedTo).toBe(`/orders/details/${payment.orderId}`);
  });

  afterEach(() => {
    order = undefined;
    payment = undefined;
    component = undefined;
    paymentsService = undefined;
    page = undefined;
    routerLinkDebugElements = undefined;
    routerLinks = undefined;
    fixture.destroy();
  });

});
