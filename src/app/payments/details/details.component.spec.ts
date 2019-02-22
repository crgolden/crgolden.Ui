import { } from 'jasmine';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, DebugElement } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { By } from '@angular/platform-browser';
import { GridModule } from '@progress/kendo-angular-grid';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RouterLinkDirectiveStub } from '../../test/stubs/router-link-directive-stub';
import { DetailsPage } from '../../test/page-models/payments/details-page';
import { DetailsComponent } from './details.component';
import { AccountService } from '../../account/account.service';
import { Payment } from '../payment';

let payment: Payment;
let component: DetailsComponent;
let fixture: ComponentFixture<DetailsComponent>;
let page: DetailsPage;
let routerLinks: RouterLinkDirectiveStub[];
let routerLinkDebugElements: DebugElement[];
let accountService: AccountService;

/* tslint:disable-next-line:component-selector */
@Component({ selector: 'router-outlet', template: '' })
class RouterOutletStubComponent { }

describe('DetailsComponent', () => {

  beforeEach(() => {
    payment = {
      id: '1',
      chargeId: 'Payment 1',
      userId: '1',
      description: 'Description 1',
      currency: 'usd',
      tokenId: 'tokenId 1',
      amount: 1.00,
      created: new Date(),
      orderId: '1'
    }
    TestBed.configureTestingModule({
      declarations: [
        DetailsComponent,
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
              data: { 'payment': payment }
            }
          }
        },
        {
          provide: Router,
          useValue: jasmine.createSpyObj('Router', ['navigate'])
        }
      ],
      imports: [
        GridModule,
        FontAwesomeModule
      ]
    });
    fixture = TestBed.createComponent(DetailsComponent);
    component = fixture.componentInstance;
    accountService = fixture.debugElement.injector.get(AccountService);
    accountService.userHasRole$ = (): Observable<boolean> => of(true);
    fixture.detectChanges();
    page = new DetailsPage(fixture);
    routerLinkDebugElements = fixture.debugElement.queryAll(By.directive(RouterLinkDirectiveStub));
    routerLinks = routerLinkDebugElements.map(de => de.injector.get(RouterLinkDirectiveStub));
  });

  it('should have the payment', () => {
    expect(component.payment).toEqual(payment);
  });

  it('should display payment details', () => {
    expect(page.chargeId.textContent.trim()).toBe(component.payment.chargeId);
    expect(page.amount.textContent.trim()).toBe(`$${component.payment.amount.toFixed(2)}`);
    expect(page.description.textContent.trim()).toBe(component.payment.description);
  });

  it('can get RouterLinks from template', () => {
    expect(routerLinks.length).toBe(2, 'should have 2 routerLinks');
    expect(routerLinks[0].linkParams).toBe(`/orders/details/${payment.orderId}`);
    expect(routerLinks[1].linkParams).toBe(`/payments/edit/${payment.id}`);
  });

  it('can click `orders/details/orderId` link in template', () => {
    const paymentsLinkDebugElement = routerLinkDebugElements[0];
    const paymentsLink = routerLinks[0];

    expect(paymentsLink.navigatedTo).toBeNull('should not have navigated yet');

    paymentsLinkDebugElement.triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(paymentsLink.navigatedTo).toBe(`/orders/details/${payment.orderId}`);
  });

  it('can click `payments/edit/:payment.id` link in template', () => {
    const paymentLinkDebugElement = routerLinkDebugElements[1];
    const paymentLink = routerLinks[1];

    expect(paymentLink.navigatedTo).toBeNull('should not have navigated yet');

    paymentLinkDebugElement.triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(paymentLink.navigatedTo).toBe(`/payments/edit/${payment.id}`);
  });

  afterEach(() => {
    payment = undefined;
    component = undefined;
    accountService = undefined;
    page = undefined;
    routerLinkDebugElements = undefined;
    routerLinks = undefined;
    fixture.destroy();
  });

});
