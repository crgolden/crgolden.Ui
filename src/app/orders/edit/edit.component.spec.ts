import { } from 'jasmine';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { FormsModule, NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Observable, of } from 'rxjs';
import { GridModule } from '@progress/kendo-angular-grid';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RouterLinkDirectiveStub } from '../../test/stubs/router-link-directive-stub';
import { EditPage } from '../../test/page-models/orders/edit-page';
import { EditComponent } from './edit.component';
import { AccountService } from '../../account/account.service';
import { Order } from '../order';
import { OrderProduct } from '../../order-products/order-product';
import { OrdersService } from '../../orders/orders.service';
import { OrderProductsService } from '../../order-products/order-products.service';
import { Payment } from '../../payments/payment';
import { Address } from '../../address/address';

let order: Order;
let shippingAddress: Address;
let component: EditComponent;
let fixture: ComponentFixture<EditComponent>;
let page: EditPage;
let routerLinks: Array<RouterLinkDirectiveStub>;
let routerLinkDebugElements: Array<DebugElement>;
let accountService: AccountService;
let ordersService: OrdersService;

/* tslint:disable-next-line:component-selector */
@Component({ selector: 'router-outlet', template: '' })
class RouterOutletStubComponent { }

describe('EditComponent', () => {

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
                'order': order
              }
            }
          }
        },
        {
          provide: Router,
          useValue: jasmine.createSpyObj('Router', ['navigate'])
        },
        {
          provide: OrdersService,
          useValue: jasmine.createSpyObj('ProductsService', { edit$: of() })
        },
        {
          provide: OrderProductsService,
          useValue: jasmine.createSpyObj('OrderProductsService', ['edit$'])
        }
      ]
    });
    fixture = TestBed.createComponent(EditComponent);
    component = fixture.componentInstance;
    ordersService = fixture.debugElement.injector.get(OrdersService);
    accountService = fixture.debugElement.injector.get(AccountService);
    accountService.userHasRole$ = (): Observable<boolean> => of(true);
    fixture.detectChanges();
    page = new EditPage(fixture);
    routerLinkDebugElements = fixture.debugElement.queryAll(By.directive(RouterLinkDirectiveStub));
    routerLinks = routerLinkDebugElements.map(de => de.injector.get(RouterLinkDirectiveStub));
  });

  it('should have the order', () => {
    expect(component.order.id).toBe(order.id);
    expect(component.order.number).toBe(order.number);
  });

  it('should display order details', () => {
    return fixture.whenStable().then(() => {
      expect(page.streetAddress.value).toBe(component.order.shippingAddress.street_address);
      expect(page.city.value).toBe(component.order.shippingAddress.locality);
      expect(page.region.value).toBe(component.order.shippingAddress.region);
      expect(page.postalCode.value).toBe(component.order.shippingAddress.postal_code);
      expect(page.country.value).toBe(component.order.shippingAddress.country);
    });
  });

  it('should call edit for valid form', () => {
    const form = { valid: true } as NgForm;

    component.edit(form);
    expect(ordersService.edit$).toHaveBeenCalled();
  });

  it('should not call edit for invalid form', () => {
    const form = { valid: false } as NgForm;

    component.edit(form);
    expect(ordersService.edit$).not.toHaveBeenCalled();
  });

  it('can get RouterLinks from template', () => {
    expect(routerLinks.length).toBe(2, 'should have 2 routerLinks');
    expect(routerLinks[0].linkParams).toBe(`/orders/details/${order.id}`);
    expect(routerLinks[1].linkParams).toBe('/orders');
  });

  it('can click `orders/details/:order.id` link in template', () => {
    const ordersLinkDebugElement = routerLinkDebugElements[0];
    const ordersLink = routerLinks[0];

    expect(ordersLink.navigatedTo).toBeNull('should not have navigated yet');

    ordersLinkDebugElement.triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(ordersLink.navigatedTo).toBe(`/orders/details/${order.id}`);
  });

  it('can click `orders` link in template', () => {
    const ordersLinkDebugElement = routerLinkDebugElements[1];
    const ordersLink = routerLinks[1];

    expect(ordersLink.navigatedTo).toBeNull('should not have navigated yet');

    ordersLinkDebugElement.triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(ordersLink.navigatedTo).toBe('/orders');
  });

  afterEach(() => {
    order = undefined;
    component = undefined;
    ordersService = undefined;
    accountService = undefined;
    page = undefined;
    routerLinkDebugElements = undefined;
    routerLinks = undefined;
    fixture.destroy();
  });

});
