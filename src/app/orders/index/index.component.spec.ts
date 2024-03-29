import { } from 'jasmine';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Component, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { Observable, of } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { GridModule } from '@progress/kendo-angular-grid';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RouterLinkDirectiveStub } from '../../test/stubs/router-link-directive-stub';
import { IndexPage } from '../../test/page-models/orders/index-page';
import { IndexComponent } from './index.component';
import { AccountService } from '../../account/account.service';
import { Order } from '../order';
import { OrdersController } from '../../orders/orders.controller';

let order1: Order;
let order2: Order;
let orders: Order[];
let ordersGridDataResult: GridDataResult;
let component: IndexComponent;
let fixture: ComponentFixture<IndexComponent>;
let page: IndexPage;
let routerLinks: RouterLinkDirectiveStub[];
let routerLinkDebugElements: DebugElement[];
let accountService: AccountService;

/* tslint:disable-next-line:component-selector */
@Component({ selector: 'router-outlet', template: '' })
class RouterOutletStubComponent { }

describe('IndexComponent', () => {

  beforeEach(() => {
    order1 = {
      id: '1',
      userId: '1',
      number: '1',
      total: 1,
      created: new Date()
    };
    order2 = {
      id: '2',
      userId: '1',
      number: '2',
      total: 1,
      created: new Date()
    };
    orders = [order1, order2];
    ordersGridDataResult = {
      data: orders,
      total: orders.length
    };
    TestBed.configureTestingModule({
      declarations: [
        IndexComponent,
        RouterLinkDirectiveStub,
        RouterOutletStubComponent
      ],
      providers: [
        {
          provide: Title,
          useValue: jasmine.createSpyObj('Title', ['setTitle'])
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: { 'orders': ordersGridDataResult }
            }
          }
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
          provide: OrdersController,
          useValue: jasmine.createSpyObj('ordersController', { index: of() })
        }
      ],
      imports: [
        GridModule,
        FontAwesomeModule
      ]
    });
    fixture = TestBed.createComponent(IndexComponent);
    component = fixture.componentInstance;
    accountService = fixture.debugElement.injector.get(AccountService);
    accountService.userHasRole$ = (): Observable<boolean> => of(true);
    fixture.detectChanges();
    page = new IndexPage(fixture);
    routerLinkDebugElements = fixture.debugElement.queryAll(By.directive(RouterLinkDirectiveStub));
    routerLinks = routerLinkDebugElements.map(de => de.injector.get(RouterLinkDirectiveStub));
  });

  it('should have the orders', () => {
    expect(component.orders.total).toBe(orders.length);
  });

  it('should display orders', () => {
    const cleanText = (text: string): number => {
      if (text == null) {
        return undefined;
      } else {
        return parseInt(text.trim(), 10);
      }
    };
    const orderRow1 = page.rows[2];
    const orderRow2 = page.rows[3];
    const orderRow1Number = cleanText(orderRow1.children[0].textContent);
    const orderRow2Number = cleanText(orderRow2.children[0].textContent);

    expect(orderRow1Number).toBe(order1.number);
    expect(orderRow2Number).toBe(order2.number);
  });

  it('can get RouterLinks from template', () => {
    expect(routerLinks.length).toBe(2, 'should have 2 routerLinks');
    expect(routerLinks[0].linkParams).toBe(`/orders/details/${order1.id}`);
    expect(routerLinks[1].linkParams).toBe(`/orders/details/${order2.id}`);
  });

  it('can click `orders/details/:orders[0].id` link in template', () => {
    const order1LinkDebugElement = routerLinkDebugElements[0];
    const order1Link = routerLinks[0];

    expect(order1Link.navigatedTo).toBeNull('should not have navigated yet');

    order1LinkDebugElement.triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(order1Link.navigatedTo).toBe(`/orders/details/${order1.id}`);
  });

  it('can click `orders/details/:orders[1].id` link in template', () => {
    const order2LinkDebugElement = routerLinkDebugElements[1];
    const order2Link = routerLinks[1];

    expect(order2Link.navigatedTo).toBeNull('should not have navigated yet');

    order2LinkDebugElement.triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(order2Link.navigatedTo).toBe(`/orders/details/${order2.id}`);
  });

  afterEach(() => {
    order1 = undefined;
    order2 = undefined;
    orders = undefined;
    ordersGridDataResult = undefined;
    component = undefined;
    page = undefined;
    routerLinkDebugElements = undefined;
    routerLinks = undefined;
    fixture.destroy();
  });

});
