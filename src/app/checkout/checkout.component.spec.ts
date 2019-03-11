import { } from 'jasmine';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject, of } from 'rxjs';
import { User } from 'oidc-client';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GridModule } from '@progress/kendo-angular-grid';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CheckoutComponent } from './checkout.component';
import { AccountService } from '../account/account.service';
import { CartsService } from '../carts/carts.service';
import { Cart } from '../carts/cart';
import { OrdersService } from '../orders/orders.service';
import { Order } from '../orders/order';
import { CartProduct } from '../cart-products/cart-product';
import { Address } from '../address/address';

let address: Address;
let user: User;
let cartProduct1: CartProduct;
let cartProduct2: CartProduct;
let cartProducts: CartProduct[];
let cart: Cart;
let order: Order;
let component: CheckoutComponent;
let fixture: ComponentFixture<CheckoutComponent>;
let accountService: AccountService;
let cartsService: CartsService;
let ordersService: OrdersService;

describe('CreateComponent', () => {

  const setup = (data: any) => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        GridModule,
        FontAwesomeModule
      ],
      declarations: [
        CheckoutComponent
      ],
      providers: [
        {
          provide: Title,
          useValue: jasmine.createSpyObj('Title', ['setTitle'])
        },
        {
          provide: NgbModal,
          useValue: jasmine.createSpyObj('NgbModal', ['open'])
        },
        {
          provide: ToastrService,
          useValue: jasmine.createSpyObj('ToastrService', ['error'])
        },
        {
          provide: AccountService,
          useValue: jasmine.createSpyObj('AccountService', ['user$'])
        },
        {
          provide: CartsService,
          useValue: jasmine.createSpyObj('CartsService', ['cart$'])
        },
        {
          provide: OrdersService,
          useValue: jasmine.createSpyObj('OrdersService', { create$: of() })
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: data
            }
          }
        },
        {
          provide: Router,
          useValue: jasmine.createSpyObj('Router', ['navigate'])
        }
      ]
    });
    fixture = TestBed.createComponent(CheckoutComponent);
    component = fixture.componentInstance;
    component.validPayment = true;
    component.validShippingAddress = true;
    address = {
      street_address: 'Street',
      locality: 'City',
      region: 'State',
      country: 'Country',
      postal_code: '12345',
      formatted: 'Street\r\nCity\r\nState 12345\r\nCountry'
    };
    user = {
      profile: {
        sub: '1',
        address: JSON.stringify(address)
      }
    } as User;
    cartProduct1 = {
      cartId: '1',
      productId: '1',
      productName: 'Product 1',
      productUnitPrice: 1.00,
      productIsDownload: false,
      productActive: true,
      productQuantityPerUnit: undefined,
      productImageThumbnailUri: undefined,
      created: new Date(),
      quantity: 1
    };
    cartProduct2 = {
      cartId: '1',
      productId: '2',
      productName: 'Product 2',
      productUnitPrice: 2.00,
      productIsDownload: true,
      productActive: true,
      productQuantityPerUnit: undefined,
      productImageThumbnailUri: undefined,
      created: new Date(),
      quantity: 1
    };
    cartProducts = [cartProduct1, cartProduct2];
    cart = {
      id: '1',
      userId: user.profile['sub'],
      created: new Date()
    };
    accountService = fixture.debugElement.injector.get(AccountService);
    accountService.user$ = new BehaviorSubject<User>(user);
    cartsService = fixture.debugElement.injector.get(CartsService);
    cartsService.cart$ = new BehaviorSubject<Cart>(cart);
    ordersService = fixture.debugElement.injector.get(OrdersService);
    fixture.detectChanges();
  };

  it('should call create for valid shipping address and zero price', () => {
    setup({
      'validAddress': true,
      'cartProducts': cartProducts.map(cartProduct => {
        cartProduct.productUnitPrice = 0;
        return cartProduct;
      })
    });
    setOrder();
    component.checkout();
    expect(ordersService.create$).toHaveBeenCalledWith(order);
  });

  it('should call create for all downloads and valid payment', () => {
    setup({
      'validAddress': false,
      'cartProducts': cartProducts.map(cartProduct => {
        cartProduct.productIsDownload = true;
        return cartProduct;
      })
    });
    setOrder();
    component.checkout();
    expect(ordersService.create$).toHaveBeenCalledWith(order);
  });

  it('should call create for valid shipping address and valid payment', () => {
    setup({
      'validAddress': true,
      'cartProducts': cartProducts
    });
    setOrder();
    component.checkout();
    expect(ordersService.create$).toHaveBeenCalledWith(order);
  });

  it('should not call create for empty cart', () => {
    setup({
      'validAddress': true,
      'cartProducts': []
    });
    component.checkout();
    expect(ordersService.create$).not.toHaveBeenCalled();
  });

  it('should not call create for invalid shipping address and valid payment', () => {
    setup({
      'validAddress': false,
      'cartProducts': cartProducts
    });
    component.checkout();
    expect(ordersService.create$).not.toHaveBeenCalled();
  });

  it('should not call create for valid shipping address and invalid payment', () => {
    setup({
      'validAddress': true,
      'cartProducts': cartProducts
    });
    component.checkout();
    expect(ordersService.create$).not.toHaveBeenCalled();
  });

  afterEach(() => {
    address = undefined as Address;
    user = undefined;
    cartProduct1 = undefined;
    cartProduct2 = undefined;
    cartProducts = undefined;
    cart = undefined as Cart;
    component = undefined;
    accountService = undefined;
    cartsService = undefined;
    ordersService = undefined;
    order = undefined;
    fixture.destroy();
  });

});

function setOrder(): void {
  order = {
    id: undefined,
    number: undefined,
    created: undefined,
    userId: cart.userId,
    total: cartProducts
      .map(cartProduct => cartProduct.quantity * cartProduct.productUnitPrice)
      .reduce((previous, current) => previous + current, 0),
    shippingAddress: address
  };
}
