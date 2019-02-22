import { } from 'jasmine';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { Component, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject, of } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { GridModule } from '@progress/kendo-angular-grid';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RouterLinkDirectiveStub } from '../../test/stubs/router-link-directive-stub';
import { EditPage } from '../../test/page-models/cart/edit-page';
import { EditComponent } from './edit.component';
import { CartService } from '../cart.service';
import { Cart } from '../cart';
import { CartProductsService } from '../../cart-products/cart-products.service';
import { CartProduct } from '../../cart-products/cart-product';

let cartProduct1: CartProduct;
let cartProduct2: CartProduct;
let cartProducts: Array<CartProduct>;
let cart: Cart;
let component: EditComponent;
let fixture: ComponentFixture<EditComponent>;
let page: EditPage;
let routerLinks: RouterLinkDirectiveStub[];
let routerLinkDebugElements: DebugElement[];
let cartService: CartService;

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
      isDownload: false,
      extendedPrice: 1.00,
      quantity: 2,
      price: 0.50
    };
    cartProduct2 = {
      cartId: '1',
      productId: '2',
      productName: 'Product 2',
      created: new Date(),
      isDownload: false,
      extendedPrice: 2.00,
      quantity: 2,
      price: 1.00
    };
    cartProducts = new Array<CartProduct>(cartProduct1, cartProduct2);
    cart = {
      id: '1',
      created: new Date(),
      cartProducts: cartProducts,
      total: cartProducts
        .map((cartProduct: CartProduct) => cartProduct.extendedPrice)
        .reduce((previous: number, current: number) => previous + current)
    };
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        InputsModule,
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
          provide: CartService,
          useValue: jasmine.createSpyObj('CartService', { edit$: of() })
        },
        {
          provide: CartProductsService,
          useValue: jasmine.createSpyObj('CartProductsService', ['edit$, delete$'])
        }
      ]
    });
    fixture = TestBed.createComponent(EditComponent);
    component = fixture.componentInstance;
    cartService = fixture.debugElement.injector.get(CartService);
    cartService.cart$ = new BehaviorSubject<Cart>(cart);
    page = new EditPage(fixture);
    fixture.detectChanges();
    routerLinkDebugElements = fixture.debugElement.queryAll(By.directive(RouterLinkDirectiveStub));
    routerLinks = routerLinkDebugElements.map(de => de.injector.get(RouterLinkDirectiveStub));
  });

  it('should have the cart', () => {
    expect(component.cart$()).toEqual(cartService.cart$);
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
    cartService = undefined;
    page = undefined;
    routerLinkDebugElements = undefined;
    routerLinks = undefined;
    fixture.destroy();
  });

});
