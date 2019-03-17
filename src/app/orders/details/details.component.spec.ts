import { } from 'jasmine';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { Observable, of } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { GridModule } from '@progress/kendo-angular-grid';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RouterLinkDirectiveStub } from '../../test/stubs/router-link-directive-stub';
import { Address } from '@clarity/core-claims';
import { DetailsPage } from '../../test/page-models/orders/details-page';
import { DetailsComponent } from './details.component';
import { AccountService } from '../../account/account.service';
import { Order } from '../order';

let order: Order;
let shippingAddress: Address;
let component: DetailsComponent;
let fixture: ComponentFixture<DetailsComponent>;
let page: DetailsPage;
let routerLinks: Array<RouterLinkDirectiveStub>;
let routerLinkDebugElements: Array<DebugElement>;
let accountService: AccountService;

/* tslint:disable-next-line:component-selector */
@Component({ selector: 'router-outlet', template: '' })
class RouterOutletStubComponent { }

describe('DetailsComponent', () => {

  beforeEach(() => {
    shippingAddress = {
      street_address: 'Street',
      locality: 'City',
      region: 'State',
      postal_code: '12345',
      country: 'US',
      formatted: 'Street\r\nCity\r\n\State 12345\r\nCountry'
    };
    order = {
      id: '1',
      userId: '1',
      number: 1,
      total: 1,
      created: new Date(),
      shippingAddress: shippingAddress
    };
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
              data: { 'order': order }
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

  it('should have the order', () => {
    expect(component.order).toEqual(order);
  });

  it('should display order details', () => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    const created = component.order.created.toLocaleDateString('en-US', options);

    const orderNumber = parseInt(page.number.textContent.trim(), 10);
    expect(orderNumber).toBe(component.order.number);
    expect(page.total.textContent.trim()).toBe(`$${component.order.total.toFixed(2)}`);
    expect(page.created.textContent.trim()).toBe(created);
  });

  it('can get RouterLinks from template', () => {
    expect(routerLinks.length).toBe(2, 'should have 2 routerLinks');
    expect(routerLinks[0].linkParams).toBe('/orders');
    expect(routerLinks[1].linkParams).toBe(`/orders/edit/${order.id}`);
  });

  it('can click `orders` link in template', () => {
    const ordersLinkDebugElement = routerLinkDebugElements[0];
    const ordersLink = routerLinks[0];

    expect(ordersLink.navigatedTo).toBeNull('should not have navigated yet');

    ordersLinkDebugElement.triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(ordersLink.navigatedTo).toBe('/orders');
  });

  it('can click `orders/edit/:order.id` link in template', () => {
    const orderLinkDebugElement = routerLinkDebugElements[1];
    const orderLink = routerLinks[1];

    expect(orderLink.navigatedTo).toBeNull('should not have navigated yet');

    orderLinkDebugElement.triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(orderLink.navigatedTo).toBe(`/orders/edit/${order.id}`);
  });

  afterEach(() => {
    order = undefined;
    component = undefined;
    page = undefined;
    routerLinkDebugElements = undefined;
    routerLinks = undefined;
    fixture.destroy();
  });

});
