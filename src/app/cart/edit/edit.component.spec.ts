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
import { EditPage } from '../../test/page-models/cart/edit-page';
import { EditComponent } from './edit.component';
import { Cart } from '../cart';
import { CartProduct } from '../../cart-products/cart-product';
import { CartService } from '../cart.service';

const cart: Cart = {
  id: '1',
  name: 'Cart 1',
  created: new Date(),
  cartProducts: new Array<CartProduct>()
};
let component: EditComponent;
let fixture: ComponentFixture<EditComponent>;
let page: EditPage;
let routerLinks: RouterLinkDirectiveStub[];
let routerLinkDebugElements: DebugElement[];
let cartService: CartService;
let router: Router;

/* tslint:disable-next-line:component-selector */
@Component({ selector: 'router-outlet', template: '' })
class RouterOutletStubComponent { }

describe('EditComponent', () => {

  beforeEach(() => setup());

  it('should have the cart', () => {
    expect(component.cart.id).toBe(cart.id);
    expect(component.cart.name).toBe(cart.name);
  });

  it('should display cart details', () => {
    return fixture.whenStable().then(() => {
      expect(page.name.value).toBe(component.cart.name);
    });
  });

  it('can get RouterLinks from template', () => {
    expect(routerLinks.length).toBe(2, 'should have 2 routerLinks');
    expect(routerLinks[0].linkParams).toBe(`/Carts/Details/${cart.id}`);
    expect(routerLinks[1].linkParams).toBe('/Carts');
  });

  it('can click Carts/Details/:product.Id link in template', () => {
    const cartLinkDebugElement = routerLinkDebugElements[0];
    const cartLink = routerLinks[0];

    expect(cartLink.navigatedTo).toBeNull('should not have navigated yet');

    cartLinkDebugElement.triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(cartLink.navigatedTo).toBe(`/Carts/Details/${cart.id}`);
  });

  it('can click Carts link in template', () => {
    const cartLinkDebugElement = routerLinkDebugElements[1];
    const cartLink = routerLinks[1];

    expect(cartLink.navigatedTo).toBeNull('should not have navigated yet');

    cartLinkDebugElement.triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(cartLink.navigatedTo).toBe('/Carts');
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
              'cart': cart
            }
          }
        }
      },
      {
        provide: Router,
        useValue: jasmine.createSpyObj('Router', { navigate: of([`/Carts/Details/${cart.id}`]) })
      },
      {
        provide: CartService,
        useValue: jasmine.createSpyObj('CartService', { edit: of() })
      }
    ]
  });
  fixture = TestBed.createComponent(EditComponent);
  component = fixture.componentInstance;
  cartService = fixture.debugElement.injector.get(CartService);
  router = fixture.debugElement.injector.get(Router);
  page = new EditPage(fixture);
  fixture.detectChanges();
  routerLinkDebugElements = fixture.debugElement.queryAll(By.directive(RouterLinkDirectiveStub));
  routerLinks = routerLinkDebugElements.map(de => de.injector.get(RouterLinkDirectiveStub));
}
