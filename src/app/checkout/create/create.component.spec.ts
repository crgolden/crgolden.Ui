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
import { CreateComponent } from './create.component';
import { AccountService } from '../../account/account.service';
import { CartService } from '../../cart/cart.service';
import { Cart } from '../../cart/cart';
import { OrdersService } from '../../orders/orders.service';
import { Order } from '../../orders/order';
import { OrderProduct } from '../../order-products/order-product';
import { CartProduct } from '../../cart-products/cart-product';
import { Address } from '../../address/address';
import { Payment } from '../../payments/payment';

let address: Address;
let user: User;
let cartProduct1: CartProduct;
let cartProduct2: CartProduct;
let cartProducts: Array<CartProduct>;
let cart: Cart;
let order: Order;
let component: CreateComponent;
let fixture: ComponentFixture<CreateComponent>;
let accountService: AccountService;
let cartService: CartService;
let ordersService: OrdersService;

describe('CreateComponent', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        GridModule,
        FontAwesomeModule
      ],
      declarations: [
        CreateComponent
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
          provide: CartService,
          useValue: jasmine.createSpyObj('CartService', ['cart$'])
        },
        {
          provide: OrdersService,
          useValue: jasmine.createSpyObj('OrdersService', { create$: of() })
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: { 'validAddress': true }
            }
          }
        },
        {
          provide: Router,
          useValue: jasmine.createSpyObj('Router', ['navigate'])
        }
      ]
    });
    fixture = TestBed.createComponent(CreateComponent);
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
      model1Id: '1',
      model1Name: 'Cart 1',
      model2Id: '1',
      model2Name: 'Product 1',
      price: 1.00,
      extendedPrice: 1.00,
      isDownload: false,
      created: new Date(),
      quantity: 1
    };
    cartProduct2 = {
      model1Id: '1',
      model1Name: 'Cart 1',
      model2Id: '2',
      model2Name: 'Product 2',
      price: 2.00,
      extendedPrice: 2.00,
      isDownload: true,
      created: new Date(),
      quantity: 1
    };
    cartProducts = new Array<CartProduct>(cartProduct1, cartProduct2);
    cart = {
      id: '1',
      name: 'Cart',
      userId: user.profile['sub'],
      created: new Date(),
      total: cartProducts
        .map((cartProduct: CartProduct) => cartProduct.extendedPrice)
        .reduce((previous: number, current: number) => previous + current),
      cartProducts: cartProducts
    };
    accountService = fixture.debugElement.injector.get(AccountService);
    accountService.user$ = new BehaviorSubject<User>(user);
    cartService = fixture.debugElement.injector.get(CartService);
    cartService.cart$ = new BehaviorSubject<Cart>(cart);
    ordersService = fixture.debugElement.injector.get(OrdersService);
    fixture.detectChanges();
  });

  it('should call create for valid shipping address and zero price', () => {
    component.validPayment = false;
    cart.total = 0;
    cartService.cart$.next(cart);
    setOrder();
    component.create();
    expect(ordersService.create$).toHaveBeenCalledWith(order);
  });

  it('should call create for all downloads and valid payment', () => {
    component.validShippingAddress = false;
    cart.cartProducts.forEach((cartProduct: CartProduct) => cartProduct.isDownload = true);
    cartService.cart$.next(cart);
    setOrder();
    component.create();
    expect(ordersService.create$).toHaveBeenCalledWith(order);
  });

  it('should call create for valid shipping address and valid payment', () => {
    setOrder();
    component.create();
    expect(ordersService.create$).toHaveBeenCalledWith(order);
  });

  it('should not call create for empty cart', () => {
    cart.cartProducts = new Array<CartProduct>();
    cartService.cart$.next(cart);
    component.create();
    expect(ordersService.create$).not.toHaveBeenCalled();
  });

  it('should not call create for invalid shipping address and valid payment', () => {
    component.validShippingAddress = false;
    component.create();
    expect(ordersService.create$).not.toHaveBeenCalled();
  });

  it('should not call create for valid shipping address and invalid payment', () => {
    component.validPayment = false;
    component.create();
    expect(ordersService.create$).not.toHaveBeenCalled();
  });

  afterEach(() => {
    address = undefined as Address;
    user = undefined;
    cartProduct1 = undefined;
    cartProduct2 = undefined;
    cartProducts = undefined;
    cart = undefined;
    component = undefined;
    accountService = undefined;
    cartService = undefined;
    ordersService = undefined;
    order = undefined;
    fixture.destroy();
  });

});

function setOrder(): void {
  order = {
    id: undefined,
    name: 'Order',
    created: undefined,
    userId: cart.userId,
    total: cart.total,
    orderProducts: cartProducts.map((cartProduct: CartProduct) => {
      return {
        model1Id: undefined,
        model1Name: 'Order',
        model2Id: cartProduct.model2Id,
        model2Name: cartProduct.model2Name,
        price: cartProduct.price,
        quantity: cartProduct.quantity,
        created: undefined,
        isDownload: cartProduct.isDownload
      } as OrderProduct;
    }),
    payments: new Array<Payment>(),
    shippingAddress: JSON.stringify(address)
  }
}
