import { } from 'jasmine';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Component, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject, of } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { GridModule } from '@progress/kendo-angular-grid';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RouterLinkDirectiveStub } from '../test/stubs/router-link-directive-stub';
import { CartPage } from '../test/page-models/cart/cart-page';
import { CartComponent } from './cart.component';
import { CartsService } from '../carts/carts.service';
import { Cart } from '../carts/cart';
import { CartProductsService } from '../cart-products/cart-products.service';
import { CartProduct } from '../cart-products/cart-product';

let cartProduct1: CartProduct;
let cartProduct2: CartProduct;
let cartProducts: CartProduct[];
let cartProductsGridDataResult: GridDataResult;
let cart: Cart;
let component: CartComponent;
let fixture: ComponentFixture<CartComponent>;
let page: CartPage;
let routerLinks: RouterLinkDirectiveStub[];
let routerLinkDebugElements: DebugElement[];
let cartsService: CartsService;

/* tslint:disable-next-line:component-selector */
@Component({ selector: 'router-outlet', template: '' })
class RouterOutletStubComponent { }

describe('EditComponent', () => {

  beforeEach(() => {
    cartProduct1 = {
      cartId: '1',
      productId: '1',
      productName: 'Product 1',
      created: new Date(),
      productIsDownload: false,
      productActive: true,
      productQuantityPerUnit: '',
      productImageThumbnailUri: undefined,
      quantity: 2,
      productUnitPrice: 0.50
    };
    cartProduct2 = {
      cartId: '1',
      productId: '2',
      productName: 'Product 2',
      created: new Date(),
      productIsDownload: false,
      productActive: true,
      productQuantityPerUnit: undefined,
      productImageThumbnailUri: undefined,
      quantity: 2,
      productUnitPrice: 1.00
    };
    cartProducts = [cartProduct1, cartProduct2];
    cartProductsGridDataResult = {
      data: cartProducts,
      total: cartProducts.length
    };
    cart = {
      id: '1',
      created: new Date()
    };
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        InputsModule,
        GridModule,
        FontAwesomeModule
      ],
      declarations: [
        CartComponent,
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
              data: { 'cartProducts': cartProductsGridDataResult }
            }
          }
        },
        {
          provide: ToastrService,
          useValue: jasmine.createSpyObj('ToastrService', ['error'])
        },
        {
          provide: CartsService,
          useValue: jasmine.createSpyObj('CartService', { edit$: of() })
        },
        {
          provide: CartProductsService,
          useValue: jasmine.createSpyObj('CartProductsService', ['edit$, delete$'])
        }
      ]
    });
    fixture = TestBed.createComponent(CartComponent);
    component = fixture.componentInstance;
    cartsService = fixture.debugElement.injector.get(CartsService);
    cartsService.cart$ = new BehaviorSubject<Cart>(cart);
    page = new CartPage(fixture);
    fixture.detectChanges();
    routerLinkDebugElements = fixture.debugElement.queryAll(By.directive(RouterLinkDirectiveStub));
    routerLinks = routerLinkDebugElements.map(de => de.injector.get(RouterLinkDirectiveStub));
  });

  it('should have the cartProducts', () => {
    expect(component.cartProductsData).toEqual(cartProductsGridDataResult);
  });

  it('can get RouterLinks from template', () => {
    expect(routerLinks.length).toBe(3, 'should have 3 routerLinks');
    expect(routerLinks[0].linkParams).toBe('/checkout');
    expect(routerLinks[1].linkParams).toBe(`/products/details/${cartProduct1.productId}`);
    expect(routerLinks[2].linkParams).toBe(`/products/details/${cartProduct2.productId}`);
  });

  it('can click `checkout` link in template', () => {
    const createLinkDebugElement = routerLinkDebugElements[0];
    const createLink = routerLinks[0];

    expect(createLink.navigatedTo).toBeNull('should not have navigated yet');

    createLinkDebugElement.triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(createLink.navigatedTo).toBe('/checkout');
  });

  it('can click `products/details/:cartProduct1.model2Id` link in template', () => {
    const product1LinkDebugElement = routerLinkDebugElements[1];
    const product1Link = routerLinks[1];

    expect(product1Link.navigatedTo).toBeNull('should not have navigated yet');

    product1LinkDebugElement.triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(product1Link.navigatedTo).toBe(`/products/details/${cartProduct1.productId}`);
  });

  it('can click `products/details/:cartProduct2.model2Id` link in template', () => {
    const product2LinkDebugElement = routerLinkDebugElements[2];
    const product2Link = routerLinks[2];

    expect(product2Link.navigatedTo).toBeNull('should not have navigated yet');

    product2LinkDebugElement.triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(product2Link.navigatedTo).toBe(`/products/details/${cartProduct2.productId}`);
  });

  afterEach(() => {
    cartProduct1 = undefined;
    cartProduct2 = undefined;
    cartProducts = undefined;
    component = undefined;
    cartsService = undefined;
    page = undefined;
    routerLinkDebugElements = undefined;
    routerLinks = undefined;
    fixture.destroy();
  });

});
