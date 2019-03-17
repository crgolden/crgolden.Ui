import { } from 'jasmine';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { GridModule } from '@progress/kendo-angular-grid';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RouterLinkDirectiveStub } from '../../test/stubs/router-link-directive-stub';
import { IndexPage } from '../../test/page-models/products/index-page';
import { IndexComponent } from './index.component';
import { AccountService } from '../../account/account.service';
import { ProductsController } from '../products.controller';
import { Product } from '../product';
import { CartService } from '../../cart/cart.service';
import { Cart } from '../../carts/cart';
import { CartProductsService } from '../../cart-products/cart-products.service';

let product1: Product;
let product2: Product;
let products: Array<Product>;
let productsGridDataResult: GridDataResult;
let component: IndexComponent;
let fixture: ComponentFixture<IndexComponent>;
let page: IndexPage;
let routerLinks: Array<RouterLinkDirectiveStub>;
let routerLinkDebugElements: Array<DebugElement>;
let accountService: AccountService;
let cartService: CartService;

/* tslint:disable-next-line:component-selector */
@Component({ selector: 'router-outlet', template: '' })
class RouterOutletStubComponent { }

describe('IndexComponent', () => {

  beforeEach(() => {
    product1 = {
      id: '1',
      name: 'Product 1',
      active: true,
      description: 'Description 1',
      unitPrice: 1.00,
      quantityPerUnit: undefined,
      isDownload: false,
      created: new Date()
    };
    product2 = {
      id: '2',
      name: 'Product 2',
      active: true,
      description: 'Description 2',
      unitPrice: 2.00,
      quantityPerUnit: undefined,
      isDownload: true,
      created: new Date()
    };
    products = new Array<Product>(product1, product2);
    productsGridDataResult = {
      data: products,
      total: products.length
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
              data: { 'products': productsGridDataResult }
            }
          }
        },
        {
          provide: Router,
          useValue: jasmine.createSpyObj('Router', ['navigate'])
        },
        {
          provide: ToastrService,
          useValue: jasmine.createSpyObj('ToastrService', ['error'])
        },
        {
          provide: AccountService,
          useValue: jasmine.createSpyObj('AccountService', ['userHasRole$'])
        },
        {
          provide: ProductsController,
          useValue: jasmine.createSpyObj('ProductsController', { index: of() })
        },
        {
          provide: CartService,
          useValue: jasmine.createSpyObj('CartService', ['cart$, details$, create$'])
        },
        {
          provide: CartProductsService,
          useValue: jasmine.createSpyObj('CartProductsService', ['create$, delete$'])
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
    cartService = fixture.debugElement.injector.get(CartService);
    cartService.cart$ = new BehaviorSubject<Cart>(new Cart());
    fixture.detectChanges();
    page = new IndexPage(fixture);
    routerLinkDebugElements = fixture.debugElement.queryAll(By.directive(RouterLinkDirectiveStub));
    routerLinks = routerLinkDebugElements.map(de => de.injector.get(RouterLinkDirectiveStub));
  });

  it('should have the products', () => {
    expect(component.products).toEqual(productsGridDataResult);
  });

  it('should have products grid', () => {
    const cleanText = (text: string): string => text == null ? '' : text.trim();
    const productRow1 = page.rows[2];
    const productRow2 = page.rows[3];
    const productRow1Name = cleanText(productRow1.children[0].children[0].children[0].textContent);
    const productRow1Price = cleanText(productRow1.children[0].children[0].children[1].textContent);
    const productRow2Name = cleanText(productRow2.children[0].children[0].children[0].textContent);
    const productRow2Price = cleanText(productRow2.children[0].children[0].children[1].textContent);

    expect(productRow1Name).toBe(product1.name);
    expect(productRow1Price).toBe(`$${product1.unitPrice.toFixed(2)}`);
    expect(productRow2Name).toBe(product2.name);
    expect(productRow2Price).toBe(`$${product2.unitPrice.toFixed(2)}`);
  });

  it('should have products list', () => {
    const cleanText = (text: string): string => text == null ? '' : text.trim();
    const productRow1 = page.rows[6];
    const productRow2 = page.rows[7];
    const productRow1Name = cleanText(productRow1.children[0].textContent);
    const productRow2Name = cleanText(productRow2.children[0].textContent);

    expect(productRow1Name).toBe(product1.name);
    expect(productRow2Name).toBe(product2.name);
  });

  it('can get RouterLinks from template', () => {
    expect(routerLinks.length).toBe(3, 'should have 3 routerLinks');
    expect(routerLinks[0].linkParams).toBe('/products/create');
    expect(routerLinks[1].linkParams).toBe(`/products/details/${product1.id}`);
    expect(routerLinks[2].linkParams).toBe(`/products/details/${product2.id}`);
  });

  it('can click `products/create` link in template', () => {
    const createLinkDebugElement = routerLinkDebugElements[0];
    const createLink = routerLinks[0];

    expect(createLink.navigatedTo).toBeNull('should not have navigated yet');

    createLinkDebugElement.triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(createLink.navigatedTo).toBe('/products/create');
  });

  it('can click `products/details/:products[0].id` link in template', () => {
    const product1LinkDebugElement = routerLinkDebugElements[1];
    const product1Link = routerLinks[1];

    expect(product1Link.navigatedTo).toBeNull('should not have navigated yet');

    product1LinkDebugElement.triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(product1Link.navigatedTo).toBe(`/products/details/${product1.id}`);
  });

  it('can click `products/details/:products[1].id` link in template', () => {
    const product2LinkDebugElement = routerLinkDebugElements[2];
    const product2Link = routerLinks[2];

    expect(product2Link.navigatedTo).toBeNull('should not have navigated yet');

    product2LinkDebugElement.triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(product2Link.navigatedTo).toBe(`/products/details/${product2.id}`);
  });

  afterEach(() => {
    product1 = undefined;
    product2 = undefined;
    products = undefined;
    productsGridDataResult = undefined;
    component = undefined;
    page = undefined;
    routerLinkDebugElements = undefined;
    routerLinks = undefined;
    fixture.destroy();
  });

});
